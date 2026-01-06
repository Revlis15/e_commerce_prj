import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { TaiKhoan, VaiTro } from '../../common/entities/tai-khoan.entity';
import { KhachHang } from '../../common/entities/khach-hang.entity';
import { NguoiBan } from '../../common/entities/nguoi-ban.entity';
import { Admin } from '../../common/entities/admin.entity';
import { GioHang } from '../../common/entities/gio-hang.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(TaiKhoan)
    private taiKhoanRepository: Repository<TaiKhoan>,
    @InjectRepository(KhachHang)
    private khachHangRepository: Repository<KhachHang>,
    @InjectRepository(NguoiBan)
    private nguoiBanRepository: Repository<NguoiBan>,
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    @InjectRepository(GioHang)
    private gioHangRepository: Repository<GioHang>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, matKhau, vaiTro } = registerDto;

    const existingUser = await this.taiKhoanRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const salt = await bcrypt.genSalt();
    const matKhauHash = await bcrypt.hash(matKhau, salt);

    const taiKhoan = this.taiKhoanRepository.create({
      email,
      matKhauHash,
      vaiTro,
      trangThai: true,
    });

    const savedTaiKhoan = await this.taiKhoanRepository.save(taiKhoan);

    if (vaiTro === VaiTro.CUSTOMER) {
      const khachHang = this.khachHangRepository.create({
        taiKhoanId: savedTaiKhoan.id,
      });
      const savedKhachHang = await this.khachHangRepository.save(khachHang);

      const gioHang = this.gioHangRepository.create({
        khachHangId: savedKhachHang.id,
      });
      await this.gioHangRepository.save(gioHang);
    } else if (vaiTro === VaiTro.SELLER) {
      const nguoiBan = this.nguoiBanRepository.create({
        taiKhoanId: savedTaiKhoan.id,
        trangThaiKiemDuyet: false,
      });
      await this.nguoiBanRepository.save(nguoiBan);
    } else if (vaiTro === VaiTro.ADMIN) {
      const admin = this.adminRepository.create({
        taiKhoanId: savedTaiKhoan.id,
      });
      await this.adminRepository.save(admin);
    }

    return this.generateTokenResponse(savedTaiKhoan);
  }

  async login(loginDto: LoginDto) {
    const { email, matKhau } = loginDto;
    const taiKhoan = await this.validateUser(email, matKhau);

    if (!taiKhoan) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokenResponse(taiKhoan);
  }

  async validateUser(email: string, matKhau: string): Promise<TaiKhoan | null> {
    const taiKhoan = await this.taiKhoanRepository.findOne({ where: { email } });

    if (!taiKhoan || !taiKhoan.trangThai) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(matKhau, taiKhoan.matKhauHash);
    if (!isPasswordValid) {
      return null;
    }

    return taiKhoan;
  }

  private generateTokenResponse(taiKhoan: TaiKhoan) {
    const payload = { id: taiKhoan.id, email: taiKhoan.email, vaiTro: taiKhoan.vaiTro };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: taiKhoan.id,
        email: taiKhoan.email,
        vaiTro: taiKhoan.vaiTro,
      },
    };
  }
}

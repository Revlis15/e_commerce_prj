import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KhachHang } from '../../common/entities/khach-hang.entity';
import { NguoiBan } from '../../common/entities/nguoi-ban.entity';
import { UpdateKhachHangDto } from './dto/update-khach-hang.dto';
import { UpdateNguoiBanDto } from './dto/update-nguoi-ban.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(KhachHang)
    private khachHangRepository: Repository<KhachHang>,
    @InjectRepository(NguoiBan)
    private nguoiBanRepository: Repository<NguoiBan>,
  ) {}

  async getKhachHangByTaiKhoanId(taiKhoanId: string): Promise<KhachHang> {
    const khachHang = await this.khachHangRepository.findOne({
      where: { taiKhoanId },
      relations: ['taiKhoan'],
    });

    if (!khachHang) {
      throw new NotFoundException('Customer not found');
    }

    return khachHang;
  }

  async getNguoiBanByTaiKhoanId(taiKhoanId: string): Promise<NguoiBan> {
    const nguoiBan = await this.nguoiBanRepository.findOne({
      where: { taiKhoanId },
      relations: ['taiKhoan'],
    });

    if (!nguoiBan) {
      throw new NotFoundException('Seller not found');
    }

    return nguoiBan;
  }

  async updateKhachHang(taiKhoanId: string, updateDto: UpdateKhachHangDto): Promise<KhachHang> {
    const khachHang = await this.getKhachHangByTaiKhoanId(taiKhoanId);
    Object.assign(khachHang, updateDto);
    return this.khachHangRepository.save(khachHang);
  }

  async updateNguoiBan(taiKhoanId: string, updateDto: UpdateNguoiBanDto): Promise<NguoiBan> {
    const nguoiBan = await this.getNguoiBanByTaiKhoanId(taiKhoanId);
    Object.assign(nguoiBan, updateDto);
    return this.nguoiBanRepository.save(nguoiBan);
  }

  async getAllNguoiBan(): Promise<NguoiBan[]> {
    return this.nguoiBanRepository.find({ relations: ['taiKhoan'] });
  }

  async approveNguoiBan(id: string): Promise<NguoiBan> {
    const nguoiBan = await this.nguoiBanRepository.findOne({ where: { id } });
    if (!nguoiBan) {
      throw new NotFoundException('Seller not found');
    }
    nguoiBan.trangThaiKiemDuyet = true;
    return this.nguoiBanRepository.save(nguoiBan);
  }

  async rejectNguoiBan(id: string): Promise<NguoiBan> {
    const nguoiBan = await this.nguoiBanRepository.findOne({ where: { id } });
    if (!nguoiBan) {
      throw new NotFoundException('Seller not found');
    }
    nguoiBan.trangThaiKiemDuyet = false;
    return this.nguoiBanRepository.save(nguoiBan);
  }
}

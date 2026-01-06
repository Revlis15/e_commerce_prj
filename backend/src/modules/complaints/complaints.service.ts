import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KhieuNai, TrangThaiKhieuNai } from '../../common/entities/khieu-nai.entity';
import { KhachHang } from '../../common/entities/khach-hang.entity';
import { CreateKhieuNaiDto } from './dto/create-khieu-nai.dto';

@Injectable()
export class ComplaintsService {
  constructor(
    @InjectRepository(KhieuNai)
    private khieuNaiRepository: Repository<KhieuNai>,
    @InjectRepository(KhachHang)
    private khachHangRepository: Repository<KhachHang>,
  ) {}

  async create(taiKhoanId: string, createDto: CreateKhieuNaiDto): Promise<KhieuNai> {
    const khachHang = await this.khachHangRepository.findOne({ where: { taiKhoanId } });

    if (!khachHang) {
      throw new NotFoundException('Customer not found');
    }

    const khieuNai = this.khieuNaiRepository.create({
      ...createDto,
      khachHangId: khachHang.id,
      trangThai: TrangThaiKhieuNai.PENDING,
    });

    return this.khieuNaiRepository.save(khieuNai);
  }

  async findAll(): Promise<KhieuNai[]> {
    return this.khieuNaiRepository.find({
      relations: ['donHang', 'khachHang'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByKhachHang(taiKhoanId: string): Promise<KhieuNai[]> {
    const khachHang = await this.khachHangRepository.findOne({ where: { taiKhoanId } });

    if (!khachHang) {
      throw new NotFoundException('Customer not found');
    }

    return this.khieuNaiRepository.find({
      where: { khachHangId: khachHang.id },
      relations: ['donHang'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<KhieuNai> {
    const khieuNai = await this.khieuNaiRepository.findOne({
      where: { id },
      relations: ['donHang', 'khachHang', 'donHang.chiTiets', 'donHang.chiTiets.sanPham'],
    });

    if (!khieuNai) {
      throw new NotFoundException('Complaint not found');
    }

    return khieuNai;
  }

  async updateStatus(id: string, trangThai: TrangThaiKhieuNai): Promise<KhieuNai> {
    const khieuNai = await this.findOne(id);
    khieuNai.trangThai = trangThai;
    return this.khieuNaiRepository.save(khieuNai);
  }
}

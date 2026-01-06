import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { SanPham } from '../../common/entities/san-pham.entity';
import { NguoiBan } from '../../common/entities/nguoi-ban.entity';
import { CreateSanPhamDto } from './dto/create-san-pham.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(SanPham)
    private sanPhamRepository: Repository<SanPham>,
    @InjectRepository(NguoiBan)
    private nguoiBanRepository: Repository<NguoiBan>,
  ) {}

  async create(taiKhoanId: string, createDto: CreateSanPhamDto): Promise<SanPham> {
    const nguoiBan = await this.nguoiBanRepository.findOne({ where: { taiKhoanId } });

    if (!nguoiBan) {
      throw new NotFoundException('Seller not found');
    }

    if (!nguoiBan.trangThaiKiemDuyet) {
      throw new ForbiddenException('Seller not approved yet');
    }

    const sanPham = this.sanPhamRepository.create({
      ...createDto,
      nguoiBanId: nguoiBan.id,
      trangThai: true,
    });

    return this.sanPhamRepository.save(sanPham);
  }

  async findAll(search?: string, danhMucId?: string): Promise<SanPham[]> {
    const where: any = { trangThai: true };

    if (search) {
      where.ten = Like(`%${search}%`);
    }

    if (danhMucId) {
      where.danhMucId = danhMucId;
    }

    return this.sanPhamRepository.find({
      where,
      relations: ['danhMuc', 'nguoiBan'],
    });
  }

  async findOne(id: string): Promise<SanPham> {
    const sanPham = await this.sanPhamRepository.findOne({
      where: { id },
      relations: ['danhMuc', 'nguoiBan', 'reviews', 'reviews.khachHang'],
    });

    if (!sanPham) {
      throw new NotFoundException('Product not found');
    }

    return sanPham;
  }

  async findByNguoiBan(taiKhoanId: string): Promise<SanPham[]> {
    const nguoiBan = await this.nguoiBanRepository.findOne({ where: { taiKhoanId } });

    if (!nguoiBan) {
      throw new NotFoundException('Seller not found');
    }

    return this.sanPhamRepository.find({
      where: { nguoiBanId: nguoiBan.id },
      relations: ['danhMuc'],
    });
  }

  async update(id: string, taiKhoanId: string, updateDto: CreateSanPhamDto): Promise<SanPham> {
    const sanPham = await this.findOne(id);
    const nguoiBan = await this.nguoiBanRepository.findOne({ where: { taiKhoanId } });

    if (!nguoiBan || sanPham.nguoiBanId !== nguoiBan.id) {
      throw new ForbiddenException('You can only update your own products');
    }

    Object.assign(sanPham, updateDto);
    return this.sanPhamRepository.save(sanPham);
  }

  async remove(id: string, taiKhoanId: string): Promise<void> {
    const sanPham = await this.findOne(id);
    const nguoiBan = await this.nguoiBanRepository.findOne({ where: { taiKhoanId } });

    if (!nguoiBan || sanPham.nguoiBanId !== nguoiBan.id) {
      throw new ForbiddenException('You can only delete your own products');
    }

    sanPham.trangThai = false;
    await this.sanPhamRepository.save(sanPham);
  }
}

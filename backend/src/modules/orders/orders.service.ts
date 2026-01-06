import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DonHang, TrangThaiDonHang } from '../../common/entities/don-hang.entity';
import { ChiTietDonHang } from '../../common/entities/chi-tiet-don-hang.entity';
import { KhachHang } from '../../common/entities/khach-hang.entity';
import { GioHang } from '../../common/entities/gio-hang.entity';
import { ThanhToan, TrangThaiThanhToan } from '../../common/entities/thanh-toan.entity';
import { CreateDonHangDto } from './dto/create-don-hang.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(DonHang)
    private donHangRepository: Repository<DonHang>,
    @InjectRepository(ChiTietDonHang)
    private chiTietDonHangRepository: Repository<ChiTietDonHang>,
    @InjectRepository(KhachHang)
    private khachHangRepository: Repository<KhachHang>,
    @InjectRepository(GioHang)
    private gioHangRepository: Repository<GioHang>,
    @InjectRepository(ThanhToan)
    private thanhToanRepository: Repository<ThanhToan>,
  ) {}

  async createOrder(taiKhoanId: string, createDto: CreateDonHangDto): Promise<DonHang> {
    const khachHang = await this.khachHangRepository.findOne({ where: { taiKhoanId } });

    if (!khachHang) {
      throw new NotFoundException('Customer not found');
    }

    const gioHang = await this.gioHangRepository.findOne({
      where: { khachHangId: khachHang.id },
      relations: ['chiTiets', 'chiTiets.sanPham'],
    });

    if (!gioHang || !gioHang.chiTiets || gioHang.chiTiets.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    let tongTien = 0;
    for (const item of gioHang.chiTiets) {
      tongTien += item.sanPham.gia * item.soLuong;
    }

    const donHang = this.donHangRepository.create({
      khachHangId: khachHang.id,
      tongTien,
      trangThai: TrangThaiDonHang.PENDING,
    });

    const savedDonHang = await this.donHangRepository.save(donHang);

    for (const item of gioHang.chiTiets) {
      const chiTiet = this.chiTietDonHangRepository.create({
        donHangId: savedDonHang.id,
        sanPhamId: item.sanPhamId,
        soLuong: item.soLuong,
        donGia: item.sanPham.gia,
      });
      await this.chiTietDonHangRepository.save(chiTiet);
    }

    const thanhToan = this.thanhToanRepository.create({
      donHangId: savedDonHang.id,
      phuongThuc: createDto.phuongThucThanhToan,
      trangThai: TrangThaiThanhToan.PENDING,
      tongTien,
    });
    await this.thanhToanRepository.save(thanhToan);

    await this.gioHangRepository
      .createQueryBuilder()
      .delete()
      .from('chi_tiet_gio_hang')
      .where('gio_hang_id = :gioHangId', { gioHangId: gioHang.id })
      .execute();

    return this.findOne(savedDonHang.id);
  }

  async findAll(taiKhoanId: string): Promise<DonHang[]> {
    const khachHang = await this.khachHangRepository.findOne({ where: { taiKhoanId } });

    if (!khachHang) {
      throw new NotFoundException('Customer not found');
    }

    return this.donHangRepository.find({
      where: { khachHangId: khachHang.id },
      relations: ['chiTiets', 'chiTiets.sanPham', 'thanhToan'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<DonHang> {
    const donHang = await this.donHangRepository.findOne({
      where: { id },
      relations: ['chiTiets', 'chiTiets.sanPham', 'chiTiets.sanPham.nguoiBan', 'thanhToan', 'khachHang'],
    });

    if (!donHang) {
      throw new NotFoundException('Order not found');
    }

    return donHang;
  }

  async updateStatus(id: string, trangThai: TrangThaiDonHang): Promise<DonHang> {
    const donHang = await this.findOne(id);
    donHang.trangThai = trangThai;
    return this.donHangRepository.save(donHang);
  }
}

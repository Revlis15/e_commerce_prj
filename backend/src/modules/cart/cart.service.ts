import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GioHang } from '../../common/entities/gio-hang.entity';
import { ChiTietGioHang } from '../../common/entities/chi-tiet-gio-hang.entity';
import { KhachHang } from '../../common/entities/khach-hang.entity';
import { SanPham } from '../../common/entities/san-pham.entity';
import { AddToCartDto } from './dto/add-to-cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(GioHang)
    private gioHangRepository: Repository<GioHang>,
    @InjectRepository(ChiTietGioHang)
    private chiTietGioHangRepository: Repository<ChiTietGioHang>,
    @InjectRepository(KhachHang)
    private khachHangRepository: Repository<KhachHang>,
    @InjectRepository(SanPham)
    private sanPhamRepository: Repository<SanPham>,
  ) {}

  async getCart(taiKhoanId: string): Promise<GioHang> {
    const khachHang = await this.khachHangRepository.findOne({ where: { taiKhoanId } });

    if (!khachHang) {
      throw new NotFoundException('Customer not found');
    }

    const gioHang = await this.gioHangRepository.findOne({
      where: { khachHangId: khachHang.id },
      relations: ['chiTiets', 'chiTiets.sanPham', 'chiTiets.sanPham.nguoiBan'],
    });

    if (!gioHang) {
      throw new NotFoundException('Cart not found');
    }

    return gioHang;
  }

  async addToCart(taiKhoanId: string, addToCartDto: AddToCartDto): Promise<ChiTietGioHang> {
    const khachHang = await this.khachHangRepository.findOne({ where: { taiKhoanId } });

    if (!khachHang) {
      throw new NotFoundException('Customer not found');
    }

    let gioHang = await this.gioHangRepository.findOne({
      where: { khachHangId: khachHang.id },
    });

    if (!gioHang) {
      gioHang = this.gioHangRepository.create({ khachHangId: khachHang.id });
      gioHang = await this.gioHangRepository.save(gioHang);
    }

    const sanPham = await this.sanPhamRepository.findOne({
      where: { id: addToCartDto.sanPhamId },
    });

    if (!sanPham) {
      throw new NotFoundException('Product not found');
    }

    if (sanPham.soLuong < addToCartDto.soLuong) {
      throw new BadRequestException('Not enough stock');
    }

    const existingItem = await this.chiTietGioHangRepository.findOne({
      where: {
        gioHangId: gioHang.id,
        sanPhamId: addToCartDto.sanPhamId,
      },
    });

    if (existingItem) {
      existingItem.soLuong += addToCartDto.soLuong;
      return this.chiTietGioHangRepository.save(existingItem);
    }

    const chiTiet = this.chiTietGioHangRepository.create({
      gioHangId: gioHang.id,
      sanPhamId: addToCartDto.sanPhamId,
      soLuong: addToCartDto.soLuong,
    });

    return this.chiTietGioHangRepository.save(chiTiet);
  }

  async updateCartItem(id: string, soLuong: number): Promise<ChiTietGioHang> {
    const chiTiet = await this.chiTietGioHangRepository.findOne({
      where: { id },
      relations: ['sanPham'],
    });

    if (!chiTiet) {
      throw new NotFoundException('Cart item not found');
    }

    if (chiTiet.sanPham.soLuong < soLuong) {
      throw new BadRequestException('Not enough stock');
    }

    chiTiet.soLuong = soLuong;
    return this.chiTietGioHangRepository.save(chiTiet);
  }

  async removeFromCart(id: string): Promise<void> {
    const result = await this.chiTietGioHangRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Cart item not found');
    }
  }

  async clearCart(taiKhoanId: string): Promise<void> {
    const khachHang = await this.khachHangRepository.findOne({ where: { taiKhoanId } });

    if (!khachHang) {
      throw new NotFoundException('Customer not found');
    }

    const gioHang = await this.gioHangRepository.findOne({
      where: { khachHangId: khachHang.id },
    });

    if (gioHang) {
      await this.chiTietGioHangRepository.delete({ gioHangId: gioHang.id });
    }
  }
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { GioHang } from '../../common/entities/gio-hang.entity';
import { ChiTietGioHang } from '../../common/entities/chi-tiet-gio-hang.entity';
import { KhachHang } from '../../common/entities/khach-hang.entity';
import { SanPham } from '../../common/entities/san-pham.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GioHang, ChiTietGioHang, KhachHang, SanPham])],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}

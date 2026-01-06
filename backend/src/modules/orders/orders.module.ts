import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { DonHang } from '../../common/entities/don-hang.entity';
import { ChiTietDonHang } from '../../common/entities/chi-tiet-don-hang.entity';
import { KhachHang } from '../../common/entities/khach-hang.entity';
import { GioHang } from '../../common/entities/gio-hang.entity';
import { ThanhToan } from '../../common/entities/thanh-toan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DonHang, ChiTietDonHang, KhachHang, GioHang, ThanhToan])],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}

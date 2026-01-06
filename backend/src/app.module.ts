import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { CartModule } from './modules/cart/cart.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { ComplaintsModule } from './modules/complaints/complaints.module';
import { TaiKhoan } from './common/entities/tai-khoan.entity';
import { KhachHang } from './common/entities/khach-hang.entity';
import { NguoiBan } from './common/entities/nguoi-ban.entity';
import { Admin } from './common/entities/admin.entity';
import { DanhMuc } from './common/entities/danh-muc.entity';
import { SanPham } from './common/entities/san-pham.entity';
import { GioHang } from './common/entities/gio-hang.entity';
import { ChiTietGioHang } from './common/entities/chi-tiet-gio-hang.entity';
import { DonHang } from './common/entities/don-hang.entity';
import { ChiTietDonHang } from './common/entities/chi-tiet-don-hang.entity';
import { ThanhToan } from './common/entities/thanh-toan.entity';
import { Review } from './common/entities/review.entity';
import { KhieuNai } from './common/entities/khieu-nai.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USER'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        entities: [
          TaiKhoan,
          KhachHang,
          NguoiBan,
          Admin,
          DanhMuc,
          SanPham,
          GioHang,
          ChiTietGioHang,
          DonHang,
          ChiTietDonHang,
          ThanhToan,
          Review,
          KhieuNai,
        ],
        synchronize: false,
        logging: false,
      }),
    }),
    AuthModule,
    UsersModule,
    ProductsModule,
    CategoriesModule,
    CartModule,
    OrdersModule,
    PaymentsModule,
    ReviewsModule,
    ComplaintsModule,
  ],
})
export class AppModule {}

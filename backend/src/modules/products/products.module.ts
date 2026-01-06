import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { SanPham } from '../../common/entities/san-pham.entity';
import { NguoiBan } from '../../common/entities/nguoi-ban.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SanPham, NguoiBan])],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}

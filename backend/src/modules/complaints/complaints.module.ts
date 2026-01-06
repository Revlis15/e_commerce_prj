import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComplaintsService } from './complaints.service';
import { ComplaintsController } from './complaints.controller';
import { KhieuNai } from '../../common/entities/khieu-nai.entity';
import { KhachHang } from '../../common/entities/khach-hang.entity';

@Module({
  imports: [TypeOrmModule.forFeature([KhieuNai, KhachHang])],
  controllers: [ComplaintsController],
  providers: [ComplaintsService],
  exports: [ComplaintsService],
})
export class ComplaintsModule {}

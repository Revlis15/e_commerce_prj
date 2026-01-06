import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { Review } from '../../common/entities/review.entity';
import { KhachHang } from '../../common/entities/khach-hang.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Review, KhachHang])],
  controllers: [ReviewsController],
  providers: [ReviewsService],
  exports: [ReviewsService],
})
export class ReviewsModule {}

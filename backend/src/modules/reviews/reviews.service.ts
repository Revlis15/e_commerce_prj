import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../../common/entities/review.entity';
import { KhachHang } from '../../common/entities/khach-hang.entity';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    @InjectRepository(KhachHang)
    private khachHangRepository: Repository<KhachHang>,
  ) {}

  async create(taiKhoanId: string, createDto: CreateReviewDto): Promise<Review> {
    const khachHang = await this.khachHangRepository.findOne({ where: { taiKhoanId } });

    if (!khachHang) {
      throw new NotFoundException('Customer not found');
    }

    const review = this.reviewRepository.create({
      ...createDto,
      khachHangId: khachHang.id,
    });

    return this.reviewRepository.save(review);
  }

  async findBySanPham(sanPhamId: string): Promise<Review[]> {
    return this.reviewRepository.find({
      where: { sanPhamId },
      relations: ['khachHang'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByKhachHang(taiKhoanId: string): Promise<Review[]> {
    const khachHang = await this.khachHangRepository.findOne({ where: { taiKhoanId } });

    if (!khachHang) {
      throw new NotFoundException('Customer not found');
    }

    return this.reviewRepository.find({
      where: { khachHangId: khachHang.id },
      relations: ['sanPham'],
      order: { createdAt: 'DESC' },
    });
  }
}

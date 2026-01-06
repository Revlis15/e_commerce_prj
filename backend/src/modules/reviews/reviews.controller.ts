import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { VaiTro } from '../../common/entities/tai-khoan.entity';

@Controller('reviews')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @Roles(VaiTro.CUSTOMER)
  async create(@CurrentUser() user: any, @Body() createDto: CreateReviewDto) {
    return this.reviewsService.create(user.id, createDto);
  }

  @Public()
  @Get('product/:sanPhamId')
  async findBySanPham(@Param('sanPhamId') sanPhamId: string) {
    return this.reviewsService.findBySanPham(sanPhamId);
  }

  @Get('my-reviews')
  @Roles(VaiTro.CUSTOMER)
  async findByKhachHang(@CurrentUser() user: any) {
    return this.reviewsService.findByKhachHang(user.id);
  }
}

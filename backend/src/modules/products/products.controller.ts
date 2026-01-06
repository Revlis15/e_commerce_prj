import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ProductsService } from './products.service';
import { CreateSanPhamDto } from './dto/create-san-pham.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { VaiTro } from '../../common/entities/tai-khoan.entity';

@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Public()
  @Get()
  async findAll(@Query('search') search?: string, @Query('danhMucId') danhMucId?: string) {
    return this.productsService.findAll(search, danhMucId);
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Get('seller/my-products')
  @Roles(VaiTro.SELLER)
  async getMyProducts(@CurrentUser() user: any) {
    return this.productsService.findByNguoiBan(user.id);
  }

  @Post()
  @Roles(VaiTro.SELLER)
  async create(@CurrentUser() user: any, @Body() createDto: CreateSanPhamDto) {
    return this.productsService.create(user.id, createDto);
  }

  @Put(':id')
  @Roles(VaiTro.SELLER)
  async update(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() updateDto: CreateSanPhamDto,
  ) {
    return this.productsService.update(id, user.id, updateDto);
  }

  @Delete(':id')
  @Roles(VaiTro.SELLER)
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.productsService.remove(id, user.id);
  }

  @Post('upload-images')
  @Roles(VaiTro.SELLER)
  @UseInterceptors(
    FilesInterceptor('images', 5, {
      storage: diskStorage({
        destination: './uploads/products',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `product-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          return callback(new Error('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max file size
      },
    }),
  )
  async uploadImages(@UploadedFiles() files: Express.Multer.File[]) {
    const imageUrls = files.map(file => `/uploads/products/${file.filename}`);
    return { urls: imageUrls };
  }
}

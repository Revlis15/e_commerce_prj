import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateDanhMucDto } from './dto/create-danh-muc.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { VaiTro } from '../../common/entities/tai-khoan.entity';

@Controller('categories')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Public()
  @Get()
  async findAll() {
    return this.categoriesService.findAll();
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Post()
  @Roles(VaiTro.ADMIN)
  async create(@Body() createDto: CreateDanhMucDto) {
    return this.categoriesService.create(createDto);
  }

  @Put(':id')
  @Roles(VaiTro.ADMIN)
  async update(@Param('id') id: string, @Body() updateDto: CreateDanhMucDto) {
    return this.categoriesService.update(id, updateDto);
  }

  @Delete(':id')
  @Roles(VaiTro.ADMIN)
  async remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}

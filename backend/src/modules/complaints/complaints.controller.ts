import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { ComplaintsService } from './complaints.service';
import { CreateKhieuNaiDto } from './dto/create-khieu-nai.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { VaiTro } from '../../common/entities/tai-khoan.entity';
import { TrangThaiKhieuNai } from '../../common/entities/khieu-nai.entity';

@Controller('complaints')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ComplaintsController {
  constructor(private readonly complaintsService: ComplaintsService) {}

  @Post()
  @Roles(VaiTro.CUSTOMER)
  async create(@CurrentUser() user: any, @Body() createDto: CreateKhieuNaiDto) {
    return this.complaintsService.create(user.id, createDto);
  }

  @Get()
  @Roles(VaiTro.ADMIN)
  async findAll() {
    return this.complaintsService.findAll();
  }

  @Get('my-complaints')
  @Roles(VaiTro.CUSTOMER)
  async findByKhachHang(@CurrentUser() user: any) {
    return this.complaintsService.findByKhachHang(user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.complaintsService.findOne(id);
  }

  @Put(':id/status')
  @Roles(VaiTro.ADMIN)
  async updateStatus(@Param('id') id: string, @Body('trangThai') trangThai: TrangThaiKhieuNai) {
    return this.complaintsService.updateStatus(id, trangThai);
  }
}

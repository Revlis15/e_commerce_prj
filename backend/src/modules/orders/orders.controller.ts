import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateDonHangDto } from './dto/create-don-hang.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { VaiTro } from '../../common/entities/tai-khoan.entity';
import { TrangThaiDonHang } from '../../common/entities/don-hang.entity';

@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @Roles(VaiTro.CUSTOMER)
  async createOrder(@CurrentUser() user: any, @Body() createDto: CreateDonHangDto) {
    return this.ordersService.createOrder(user.id, createDto);
  }

  @Get()
  @Roles(VaiTro.CUSTOMER)
  async findAll(@CurrentUser() user: any) {
    return this.ordersService.findAll(user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Put(':id/status')
  @Roles(VaiTro.SELLER, VaiTro.ADMIN)
  async updateStatus(@Param('id') id: string, @Body('trangThai') trangThai: TrangThaiDonHang) {
    return this.ordersService.updateStatus(id, trangThai);
  }
}

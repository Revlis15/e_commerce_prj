import { Controller, Get, Put, Body, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateKhachHangDto } from './dto/update-khach-hang.dto';
import { UpdateNguoiBanDto } from './dto/update-nguoi-ban.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { VaiTro } from '../../common/entities/tai-khoan.entity';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('customer/profile')
  @Roles(VaiTro.CUSTOMER)
  async getCustomerProfile(@CurrentUser() user: any) {
    return this.usersService.getKhachHangByTaiKhoanId(user.id);
  }

  @Put('customer/profile')
  @Roles(VaiTro.CUSTOMER)
  async updateCustomerProfile(
    @CurrentUser() user: any,
    @Body() updateDto: UpdateKhachHangDto,
  ) {
    return this.usersService.updateKhachHang(user.id, updateDto);
  }

  @Get('seller/profile')
  @Roles(VaiTro.SELLER)
  async getSellerProfile(@CurrentUser() user: any) {
    return this.usersService.getNguoiBanByTaiKhoanId(user.id);
  }

  @Put('seller/profile')
  @Roles(VaiTro.SELLER)
  async updateSellerProfile(
    @CurrentUser() user: any,
    @Body() updateDto: UpdateNguoiBanDto,
  ) {
    return this.usersService.updateNguoiBan(user.id, updateDto);
  }

  @Get('sellers')
  @Roles(VaiTro.ADMIN)
  async getAllSellers() {
    return this.usersService.getAllNguoiBan();
  }

  @Put('sellers/:id/approve')
  @Roles(VaiTro.ADMIN)
  async approveSeller(@Param('id') id: string) {
    return this.usersService.approveNguoiBan(id);
  }

  @Put('sellers/:id/reject')
  @Roles(VaiTro.ADMIN)
  async rejectSeller(@Param('id') id: string) {
    return this.usersService.rejectNguoiBan(id);
  }
}

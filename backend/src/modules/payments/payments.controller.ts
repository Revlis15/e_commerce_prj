import { Controller, Get, Put, Param, Body, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { VaiTro } from '../../common/entities/tai-khoan.entity';
import { TrangThaiThanhToan } from '../../common/entities/thanh-toan.entity';

@Controller('payments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(id);
  }

  @Put(':id/status')
  @Roles(VaiTro.ADMIN)
  async updateStatus(@Param('id') id: string, @Body('trangThai') trangThai: TrangThaiThanhToan) {
    return this.paymentsService.updateStatus(id, trangThai);
  }
}

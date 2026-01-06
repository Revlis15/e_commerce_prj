import { IsEnum, IsNotEmpty } from 'class-validator';
import { PhuongThucThanhToan } from '../../../common/entities/thanh-toan.entity';

export class CreateDonHangDto {
  @IsEnum(PhuongThucThanhToan)
  @IsNotEmpty()
  phuongThucThanhToan: PhuongThucThanhToan;
}

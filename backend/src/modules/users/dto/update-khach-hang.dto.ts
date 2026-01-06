import { IsOptional, IsString } from 'class-validator';

export class UpdateKhachHangDto {
  @IsOptional()
  @IsString()
  hoTen?: string;

  @IsOptional()
  @IsString()
  soDienThoai?: string;

  @IsOptional()
  @IsString()
  diaChi?: string;
}

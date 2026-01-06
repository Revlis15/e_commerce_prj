import { IsOptional, IsString } from 'class-validator';

export class UpdateNguoiBanDto {
  @IsOptional()
  @IsString()
  tenCuaHang?: string;

  @IsOptional()
  @IsString()
  moTa?: string;
}

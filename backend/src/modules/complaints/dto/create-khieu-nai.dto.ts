import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateKhieuNaiDto {
  @IsString()
  @IsNotEmpty()
  donHangId: string;

  @IsString()
  @IsNotEmpty()
  noiDung: string;

  @IsArray()
  @IsOptional()
  bangChung?: string[];
}

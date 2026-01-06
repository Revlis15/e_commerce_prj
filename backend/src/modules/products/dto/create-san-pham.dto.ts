import { IsNotEmpty, IsNumber, IsString, IsOptional, IsArray, Min } from 'class-validator';

export class CreateSanPhamDto {
  @IsString()
  @IsNotEmpty()
  ten: string;

  @IsString()
  @IsOptional()
  moTa?: string;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  gia: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  soLuong: number;

  @IsString()
  @IsNotEmpty()
  danhMucId: string;

  @IsArray()
  @IsOptional()
  hinhAnh?: string[];
}

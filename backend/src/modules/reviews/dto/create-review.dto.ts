import { IsNotEmpty, IsNumber, IsOptional, IsString, Min, Max } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  @IsNotEmpty()
  sanPhamId: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  danhGia: number;

  @IsOptional()
  @IsString()
  noiDung?: string;
}

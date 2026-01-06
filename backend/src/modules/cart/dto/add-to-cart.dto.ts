import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class AddToCartDto {
  @IsString()
  @IsNotEmpty()
  sanPhamId: string;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  soLuong: number;
}

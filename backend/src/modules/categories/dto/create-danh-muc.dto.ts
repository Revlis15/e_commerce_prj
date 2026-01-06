import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateDanhMucDto {
  @IsString()
  @IsNotEmpty()
  ten: string;

  @IsOptional()
  @IsString()
  parentId?: string;
}

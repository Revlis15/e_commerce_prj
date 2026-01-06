import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { VaiTro } from '../../../common/entities/tai-khoan.entity';

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  matKhau: string;

  @IsEnum(VaiTro)
  @IsNotEmpty()
  vaiTro: VaiTro;
}

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaiKhoan } from '../../../common/entities/tai-khoan.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectRepository(TaiKhoan)
    private taiKhoanRepository: Repository<TaiKhoan>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    const { id } = payload;
    const taiKhoan = await this.taiKhoanRepository.findOne({ where: { id } });

    if (!taiKhoan || !taiKhoan.trangThai) {
      throw new UnauthorizedException();
    }

    return taiKhoan;
  }
}

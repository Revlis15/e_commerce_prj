import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { KhachHang } from '../../common/entities/khach-hang.entity';
import { NguoiBan } from '../../common/entities/nguoi-ban.entity';
import { Admin } from '../../common/entities/admin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([KhachHang, NguoiBan, Admin])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}

import { SetMetadata } from '@nestjs/common';
import { VaiTro } from '../entities/tai-khoan.entity';

export const Roles = (...roles: VaiTro[]) => SetMetadata('roles', roles);

import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TaiKhoan, VaiTro } from '../../common/entities/tai-khoan.entity';
import { KhachHang } from '../../common/entities/khach-hang.entity';
import { NguoiBan } from '../../common/entities/nguoi-ban.entity';
import { Admin } from '../../common/entities/admin.entity';
import { GioHang } from '../../common/entities/gio-hang.entity';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let mockTaiKhoanRepository: any;
  let mockJwtService: any;

  beforeEach(async () => {
    mockTaiKhoanRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    mockJwtService = {
      sign: jest.fn().mockReturnValue('mock-jwt-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(TaiKhoan),
          useValue: mockTaiKhoanRepository,
        },
        {
          provide: getRepositoryToken(KhachHang),
          useValue: { create: jest.fn(), save: jest.fn() },
        },
        {
          provide: getRepositoryToken(NguoiBan),
          useValue: { create: jest.fn(), save: jest.fn() },
        },
        {
          provide: getRepositoryToken(Admin),
          useValue: { create: jest.fn(), save: jest.fn() },
        },
        {
          provide: getRepositoryToken(GioHang),
          useValue: { create: jest.fn(), save: jest.fn() },
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user if credentials are valid', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        matKhauHash: await bcrypt.hash('password123', 10),
        vaiTro: VaiTro.CUSTOMER,
        trangThai: true,
      };

      mockTaiKhoanRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.validateUser('test@example.com', 'password123');

      expect(result).toBeDefined();
      expect(result.email).toBe('test@example.com');
    });

    it('should return null if user not found', async () => {
      mockTaiKhoanRepository.findOne.mockResolvedValue(null);

      const result = await service.validateUser('wrong@example.com', 'password123');

      expect(result).toBeNull();
    });
  });
});

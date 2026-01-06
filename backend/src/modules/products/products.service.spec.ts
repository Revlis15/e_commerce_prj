import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SanPham } from '../../common/entities/san-pham.entity';
import { NguoiBan } from '../../common/entities/nguoi-ban.entity';

describe('ProductsService', () => {
  let service: ProductsService;
  let mockSanPhamRepository: any;
  let mockNguoiBanRepository: any;

  beforeEach(async () => {
    mockSanPhamRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    mockNguoiBanRepository = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(SanPham),
          useValue: mockSanPhamRepository,
        },
        {
          provide: getRepositoryToken(NguoiBan),
          useValue: mockNguoiBanRepository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const mockProducts = [
        { id: '1', ten: 'Product 1', gia: 100, trangThai: true },
        { id: '2', ten: 'Product 2', gia: 200, trangThai: true },
      ];

      mockSanPhamRepository.find.mockResolvedValue(mockProducts);

      const result = await service.findAll();

      expect(result).toEqual(mockProducts);
      expect(mockSanPhamRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single product', async () => {
      const mockProduct = { id: '1', ten: 'Product 1', gia: 100 };

      mockSanPhamRepository.findOne.mockResolvedValue(mockProduct);

      const result = await service.findOne('1');

      expect(result).toEqual(mockProduct);
    });

    it('should throw NotFoundException if product not found', async () => {
      mockSanPhamRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow('Product not found');
    });
  });
});

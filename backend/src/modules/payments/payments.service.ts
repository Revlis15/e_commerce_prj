import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ThanhToan, TrangThaiThanhToan } from '../../common/entities/thanh-toan.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(ThanhToan)
    private thanhToanRepository: Repository<ThanhToan>,
  ) {}

  async findOne(id: string): Promise<ThanhToan> {
    const thanhToan = await this.thanhToanRepository.findOne({
      where: { id },
      relations: ['donHang'],
    });

    if (!thanhToan) {
      throw new NotFoundException('Payment not found');
    }

    return thanhToan;
  }

  async updateStatus(id: string, trangThai: TrangThaiThanhToan): Promise<ThanhToan> {
    const thanhToan = await this.findOne(id);
    thanhToan.trangThai = trangThai;
    return this.thanhToanRepository.save(thanhToan);
  }
}

import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { DonHang } from './don-hang.entity';

export enum PhuongThucThanhToan {
  COD = 'COD',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CREDIT_CARD = 'CREDIT_CARD',
  E_WALLET = 'E_WALLET',
}

export enum TrangThaiThanhToan {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

@Entity('thanh_toan')
export class ThanhToan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'don_hang_id' })
  donHangId: string;

  @OneToOne(() => DonHang, donHang => donHang.thanhToan)
  @JoinColumn({ name: 'don_hang_id' })
  donHang: DonHang;

  @Column({ name: 'phuong_thuc', length: 50 })
  phuongThuc: PhuongThucThanhToan;

  @Column({ name: 'trang_thai', length: 50, default: TrangThaiThanhToan.PENDING })
  trangThai: TrangThaiThanhToan;

  @Column({ name: 'tong_tien', type: 'decimal', precision: 15, scale: 2 })
  tongTien: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

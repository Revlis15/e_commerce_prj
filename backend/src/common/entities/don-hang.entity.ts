import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { KhachHang } from './khach-hang.entity';
import { ChiTietDonHang } from './chi-tiet-don-hang.entity';
import { ThanhToan } from './thanh-toan.entity';
import { KhieuNai } from './khieu-nai.entity';

export enum TrangThaiDonHang {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  SHIPPING = 'SHIPPING',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

@Entity('don_hang')
export class DonHang {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'khach_hang_id' })
  khachHangId: string;

  @ManyToOne(() => KhachHang, khachHang => khachHang.donHangs)
  @JoinColumn({ name: 'khach_hang_id' })
  khachHang: KhachHang;

  @Column({ name: 'tong_tien', type: 'decimal', precision: 15, scale: 2 })
  tongTien: number;

  @Column({ name: 'trang_thai', length: 50, default: TrangThaiDonHang.PENDING })
  trangThai: TrangThaiDonHang;

  @OneToMany(() => ChiTietDonHang, chiTietDonHang => chiTietDonHang.donHang)
  chiTiets: ChiTietDonHang[];

  @OneToOne(() => ThanhToan, thanhToan => thanhToan.donHang)
  thanhToan: ThanhToan;

  @OneToMany(() => KhieuNai, khieuNai => khieuNai.donHang)
  khieuNais: KhieuNai[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

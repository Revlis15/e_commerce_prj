import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { DonHang } from './don-hang.entity';
import { KhachHang } from './khach-hang.entity';

export enum TrangThaiKhieuNai {
  PENDING = 'PENDING',
  INVESTIGATING = 'INVESTIGATING',
  RESOLVED = 'RESOLVED',
  REJECTED = 'REJECTED',
}

@Entity('khieu_nai')
export class KhieuNai {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'don_hang_id' })
  donHangId: string;

  @ManyToOne(() => DonHang, donHang => donHang.khieuNais)
  @JoinColumn({ name: 'don_hang_id' })
  donHang: DonHang;

  @Column({ name: 'khach_hang_id' })
  khachHangId: string;

  @ManyToOne(() => KhachHang, khachHang => khachHang.khieuNais)
  @JoinColumn({ name: 'khach_hang_id' })
  khachHang: KhachHang;

  @Column({ name: 'noi_dung', type: 'text' })
  noiDung: string;

  @Column({ name: 'bang_chung', type: 'jsonb', nullable: true })
  bangChung: string[];

  @Column({ name: 'trang_thai', length: 50, default: TrangThaiKhieuNai.PENDING })
  trangThai: TrangThaiKhieuNai;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

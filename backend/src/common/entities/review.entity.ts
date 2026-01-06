import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { SanPham } from './san-pham.entity';
import { KhachHang } from './khach-hang.entity';

@Entity('review')
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'san_pham_id' })
  sanPhamId: string;

  @ManyToOne(() => SanPham, sanPham => sanPham.reviews)
  @JoinColumn({ name: 'san_pham_id' })
  sanPham: SanPham;

  @Column({ name: 'khach_hang_id' })
  khachHangId: string;

  @ManyToOne(() => KhachHang, khachHang => khachHang.reviews)
  @JoinColumn({ name: 'khach_hang_id' })
  khachHang: KhachHang;

  @Column({ name: 'danh_gia', type: 'int' })
  danhGia: number;

  @Column({ name: 'noi_dung', type: 'text', nullable: true })
  noiDung: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

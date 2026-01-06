import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { DonHang } from './don-hang.entity';
import { SanPham } from './san-pham.entity';

@Entity('chi_tiet_don_hang')
export class ChiTietDonHang {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'don_hang_id' })
  donHangId: string;

  @ManyToOne(() => DonHang, donHang => donHang.chiTiets)
  @JoinColumn({ name: 'don_hang_id' })
  donHang: DonHang;

  @Column({ name: 'san_pham_id' })
  sanPhamId: string;

  @ManyToOne(() => SanPham, sanPham => sanPham.chiTietDonHangs)
  @JoinColumn({ name: 'san_pham_id' })
  sanPham: SanPham;

  @Column({ name: 'so_luong', type: 'int' })
  soLuong: number;

  @Column({ name: 'don_gia', type: 'decimal', precision: 15, scale: 2 })
  donGia: number;
}

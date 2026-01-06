import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { GioHang } from './gio-hang.entity';
import { SanPham } from './san-pham.entity';

@Entity('chi_tiet_gio_hang')
export class ChiTietGioHang {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'gio_hang_id' })
  gioHangId: string;

  @ManyToOne(() => GioHang, gioHang => gioHang.chiTiets)
  @JoinColumn({ name: 'gio_hang_id' })
  gioHang: GioHang;

  @Column({ name: 'san_pham_id' })
  sanPhamId: string;

  @ManyToOne(() => SanPham, sanPham => sanPham.chiTietGioHangs)
  @JoinColumn({ name: 'san_pham_id' })
  sanPham: SanPham;

  @Column({ name: 'so_luong', type: 'int' })
  soLuong: number;
}

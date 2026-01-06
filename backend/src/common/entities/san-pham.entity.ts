import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { NguoiBan } from './nguoi-ban.entity';
import { DanhMuc } from './danh-muc.entity';
import { ChiTietGioHang } from './chi-tiet-gio-hang.entity';
import { ChiTietDonHang } from './chi-tiet-don-hang.entity';
import { Review } from './review.entity';

@Entity('san_pham')
export class SanPham {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'nguoi_ban_id' })
  nguoiBanId: string;

  @ManyToOne(() => NguoiBan, nguoiBan => nguoiBan.sanPhams)
  @JoinColumn({ name: 'nguoi_ban_id' })
  nguoiBan: NguoiBan;

  @Column({ name: 'danh_muc_id' })
  danhMucId: string;

  @ManyToOne(() => DanhMuc)
  @JoinColumn({ name: 'danh_muc_id' })
  danhMuc: DanhMuc;

  @Column({ length: 255 })
  ten: string;

  @Column({ name: 'mo_ta', type: 'text', nullable: true })
  moTa: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  gia: number;

  @Column({ name: 'so_luong', type: 'int' })
  soLuong: number;

  @Column({ name: 'hinh_anh', type: 'jsonb', nullable: true })
  hinhAnh: string[];

  @Column({ name: 'trang_thai', default: true })
  trangThai: boolean;

  @OneToMany(() => ChiTietGioHang, chiTietGioHang => chiTietGioHang.sanPham)
  chiTietGioHangs: ChiTietGioHang[];

  @OneToMany(() => ChiTietDonHang, chiTietDonHang => chiTietDonHang.sanPham)
  chiTietDonHangs: ChiTietDonHang[];

  @OneToMany(() => Review, review => review.sanPham)
  reviews: Review[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

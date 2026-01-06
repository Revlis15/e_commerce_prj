import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { TaiKhoan } from './tai-khoan.entity';
import { GioHang } from './gio-hang.entity';
import { DonHang } from './don-hang.entity';
import { Review } from './review.entity';
import { KhieuNai } from './khieu-nai.entity';

@Entity('khach_hang')
export class KhachHang {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tai_khoan_id' })
  taiKhoanId: string;

  @ManyToOne(() => TaiKhoan)
  @JoinColumn({ name: 'tai_khoan_id' })
  taiKhoan: TaiKhoan;

  @Column({ name: 'ho_ten', length: 255, nullable: true })
  hoTen: string;

  @Column({ name: 'so_dien_thoai', length: 20, nullable: true })
  soDienThoai: string;

  @Column({ name: 'dia_chi', type: 'text', nullable: true })
  diaChi: string;

  @OneToOne(() => GioHang, gioHang => gioHang.khachHang)
  gioHang: GioHang;

  @OneToMany(() => DonHang, donHang => donHang.khachHang)
  donHangs: DonHang[];

  @OneToMany(() => Review, review => review.khachHang)
  reviews: Review[];

  @OneToMany(() => KhieuNai, khieuNai => khieuNai.khachHang)
  khieuNais: KhieuNai[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

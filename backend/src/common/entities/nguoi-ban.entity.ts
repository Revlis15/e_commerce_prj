import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { TaiKhoan } from './tai-khoan.entity';
import { SanPham } from './san-pham.entity';

@Entity('nguoi_ban')
export class NguoiBan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tai_khoan_id' })
  taiKhoanId: string;

  @ManyToOne(() => TaiKhoan)
  @JoinColumn({ name: 'tai_khoan_id' })
  taiKhoan: TaiKhoan;

  @Column({ name: 'ten_cua_hang', length: 255, nullable: true })
  tenCuaHang: string;

  @Column({ name: 'mo_ta', type: 'text', nullable: true })
  moTa: string;

  @Column({ name: 'trang_thai_kiem_duyet', default: false })
  trangThaiKiemDuyet: boolean;

  @OneToMany(() => SanPham, sanPham => sanPham.nguoiBan)
  sanPhams: SanPham[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

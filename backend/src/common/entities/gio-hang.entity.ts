import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { KhachHang } from './khach-hang.entity';
import { ChiTietGioHang } from './chi-tiet-gio-hang.entity';

@Entity('gio_hang')
export class GioHang {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'khach_hang_id' })
  khachHangId: string;

  @OneToOne(() => KhachHang, khachHang => khachHang.gioHang)
  @JoinColumn({ name: 'khach_hang_id' })
  khachHang: KhachHang;

  @OneToMany(() => ChiTietGioHang, chiTietGioHang => chiTietGioHang.gioHang)
  chiTiets: ChiTietGioHang[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

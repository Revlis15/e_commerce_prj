import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { TaiKhoan } from './tai-khoan.entity';

@Entity('admin')
export class Admin {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tai_khoan_id' })
  taiKhoanId: string;

  @ManyToOne(() => TaiKhoan)
  @JoinColumn({ name: 'tai_khoan_id' })
  taiKhoan: TaiKhoan;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne } from 'typeorm';

export enum VaiTro {
  CUSTOMER = 'CUSTOMER',
  SELLER = 'SELLER',
  ADMIN = 'ADMIN',
}

@Entity('tai_khoan')
export class TaiKhoan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ name: 'mat_khau_hash' })
  matKhauHash: string;

  @Column({
    type: 'enum',
    enum: VaiTro,
    name: 'vai_tro',
  })
  vaiTro: VaiTro;

  @Column({ name: 'trang_thai', default: true })
  trangThai: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

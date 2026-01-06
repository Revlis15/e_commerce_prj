import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity('danh_muc')
export class DanhMuc {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  ten: string;

  @Column({ name: 'parent_id', nullable: true })
  parentId: string;

  @ManyToOne(() => DanhMuc, danhMuc => danhMuc.children, { nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent: DanhMuc;

  @OneToMany(() => DanhMuc, danhMuc => danhMuc.parent)
  children: DanhMuc[];
}

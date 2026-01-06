import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DanhMuc } from '../../common/entities/danh-muc.entity';
import { CreateDanhMucDto } from './dto/create-danh-muc.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(DanhMuc)
    private danhMucRepository: Repository<DanhMuc>,
  ) {}

  async create(createDto: CreateDanhMucDto): Promise<DanhMuc> {
    const danhMuc = this.danhMucRepository.create(createDto);
    return this.danhMucRepository.save(danhMuc);
  }

  async findAll(): Promise<DanhMuc[]> {
    return this.danhMucRepository.find({ relations: ['parent', 'children'] });
  }

  async findOne(id: string): Promise<DanhMuc> {
    const danhMuc = await this.danhMucRepository.findOne({
      where: { id },
      relations: ['parent', 'children'],
    });

    if (!danhMuc) {
      throw new NotFoundException('Category not found');
    }

    return danhMuc;
  }

  async update(id: string, updateDto: CreateDanhMucDto): Promise<DanhMuc> {
    const danhMuc = await this.findOne(id);
    Object.assign(danhMuc, updateDto);
    return this.danhMucRepository.save(danhMuc);
  }

  async remove(id: string): Promise<void> {
    const result = await this.danhMucRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Category not found');
    }
  }
}

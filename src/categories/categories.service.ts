import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { Repository } from 'typeorm';
import { CategoryHistoryEntity } from './entities/category_history.entity';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
    @InjectRepository(CategoryHistoryEntity)
    private categoryHistoryRepository: Repository<CategoryHistoryEntity>,
  ) { }

  async getAllCategories() {
    const categories = await this.categoryRepository.find({
      where: { is_deleted: false },
    });
    if (!categories) {
      throw new NotFoundException();
    }
    return categories;
  }

  async createCategory(dto: CreateCategoryDto) {
    await this.categoryRepository.insert({
      name: dto.name,
      description: dto.description,
    });
  }
}

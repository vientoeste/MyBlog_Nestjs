import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { Repository } from 'typeorm';
import { CategoryHistoryEntity } from './entities/category_history.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
    @InjectRepository(CategoryHistoryEntity)
    private categoryHistoryRepository: Repository<CategoryHistoryEntity>,
  ) { }
}

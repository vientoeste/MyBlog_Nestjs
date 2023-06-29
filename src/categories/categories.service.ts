import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { Repository } from 'typeorm';
import { CategoryHistoryEntity } from './entities/category_history.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { PostEntity } from 'src/posts/entities/post.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
    @InjectRepository(CategoryHistoryEntity)
    private categoryHistoryRepository: Repository<CategoryHistoryEntity>,
    @InjectRepository(PostEntity)
    private postRepository: Repository<PostEntity>,
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

  async getPostsByCategory(categoryId: number) {
    const posts = await this.postRepository.find({
      where: {
        category_id: categoryId,
        is_deleted: false,
      },
    });
    if (!posts) {
      throw new NotFoundException();
    }
    return posts;
  }
}

import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { Repository } from 'typeorm';
import { CategoryHistoryEntity } from './entities/category_history.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { PostEntity } from 'src/posts/entities/post.entity';
import { NotUpdatedException } from 'src/common/exception';
import { getDateForDb } from 'src/common/util';
import { ResultSetHeader } from 'mysql2';
import { historyMonitor } from 'src/main';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PreviewPostDTO } from 'src/posts/dto/get-post-preview.dto';
import { CategoryDto } from './dto/get-category';

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

  async getAllCategories(): Promise<CategoryDto[]> {
    const categories = await this.categoryRepository.find({
      where: { is_deleted: false },
    });
    if (!categories) {
      throw new NotFoundException();
    }
    return categories.map((category) => ({
      id: category.id,
      name: category.name,
      description: category.description ?? undefined,
      createdAt: category.created_at,
      updatedAt: category.updated_at,
    }));
  }

  async createCategory(dto: CreateCategoryDto): Promise<void> {
    await this.categoryRepository.insert({
      name: dto.name,
      description: dto.description,
    });
  }

  async getPostsByCategory(categoryId: number): Promise<PreviewPostDTO[]> {
    const posts = await this.postRepository.find({
      select: ['uuid', 'title', 'content', 'category_id', 'created_at', 'updated_at'],
      where: {
        category_id: categoryId,
        is_deleted: false,
        is_published: true,
      },
    });
    if (!posts) {
      throw new NotFoundException();
    }
    return posts.map((post) => ({
      uuid: post.uuid,
      title: post.title,
      content: post.content,
      categoryId: post.category_id,
      createdAt: post.created_at,
      updatedAt: post.updated_at,
    }));
  }

  async deleteCategoryById(categoryId: number): Promise<void> {
    // [TODO] needs refactoring to reduce query count
    const category = await this.categoryRepository.findOneBy({
      id: categoryId,
      is_deleted: false,
    });
    if (!category) {
      throw new NotFoundException('category not found');
    }

    const { affected } = await this.categoryRepository.update({
      id: categoryId,
      is_deleted: false,
    }, {
      is_deleted: true,
    });
    if (affected !== 1) {
      console.log('not updated');
      throw new NotUpdatedException();
    }

    const categoryHistoryObjToStore = {
      category_id: category.id,
      name: category.name,
      description: category.description,
      deleted_at: getDateForDb(),
    };
    this.categoryHistoryRepository.insert(categoryHistoryObjToStore)
      .then((v: { raw: ResultSetHeader }) => {
        if (v.raw.affectedRows !== 1) {
          historyMonitor.insertFailedJob(categoryHistoryObjToStore as Record<string, undefined>);
          throw new InternalServerErrorException();
        }
      })
      .catch((e) => {
        console.error(e);
        historyMonitor.insertFailedJob(categoryHistoryObjToStore as Record<string, undefined>);
      });
  }

  async updateCategory(
    categoryDto: UpdateCategoryDto,
    id: number,
  ): Promise<void> {
    const category = await this.categoryRepository.findOneBy({
      id,
      is_deleted: false,
    });
    if (!category) {
      throw new NotFoundException();
    }

    const categoryHistoryObjToStore = {
      category_id: id,
      name: category.name,
      description: category.description,
    };

    // [TODO] job sequence?
    await this.categoryRepository.update(id, categoryDto);
    this.categoryHistoryRepository.insert(categoryHistoryObjToStore)
      .then((v: { raw: ResultSetHeader }) => {
        if (v.raw.affectedRows !== 1) {
          historyMonitor.insertFailedJob(categoryHistoryObjToStore as Record<string, unknown>);
          throw new InternalServerErrorException();
        }
      })
      .catch((e) => {
        console.error(e);
        historyMonitor.insertFailedJob(categoryHistoryObjToStore as Record<string, unknown>);
      });
  }
}

import { BadRequestException, Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Req } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
  ) { }

  @Get()
  @HttpCode(200)
  async findAll() {
    return this.categoriesService.getAllCategories();
  }

  @Post()
  @HttpCode(201)
  async createNewCategory(
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    if (!createCategoryDto.name) {
      throw new BadRequestException();
    }
    await this.categoriesService.createCategory(createCategoryDto);
    return;
  }

  @Get(':categoryId')
  @HttpCode(200)
  async fetchPostsById(
    @Param('categoryId') categoryId: number,
  ) {
    const posts = await this.categoriesService.getPostsByCategory(categoryId);
    return posts;
  }

  @Patch(':categoryId')
  @HttpCode(200)
  updateCategoryInfoById(
    @Param('categoryId') categoryId: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return;
  }

  @Delete(':categoryId')
  @HttpCode(204)
  async deleteCategoryById(
    @Param('categoryId') categoryId: number,
  ) {
    await this.categoriesService.deleteCategoryById(categoryId);
    return;
  }
}

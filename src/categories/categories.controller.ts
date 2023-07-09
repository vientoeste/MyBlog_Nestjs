import { BadRequestException, Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoriesService } from './categories.service';
import { PatchValidationPipe } from 'src/common/pipes/patch-validation.pipe';
import { AuthGuard } from 'src/auth/auth.guard';

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
  @UseGuards(AuthGuard)
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
  @UseGuards(AuthGuard)
  async updateCategoryInfoById(
    @Param('categoryId') categoryId: number,
    @Body(new PatchValidationPipe<UpdateCategoryDto>(['name', 'description'])) updateCategoryDto: UpdateCategoryDto,
  ) {
    await this.categoriesService.updateCategory(updateCategoryDto, categoryId);
    return;
  }

  @Delete(':categoryId')
  @HttpCode(204)
  @UseGuards(AuthGuard)
  async deleteCategoryById(
    @Param('categoryId') categoryId: number,
  ) {
    await this.categoriesService.deleteCategoryById(categoryId);
    return;
  }
}

import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Req } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  @Get()
  @HttpCode(200)
  findAll() {
    return;
  }

  @Post()
  @HttpCode(201)
  createNewCategory(
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    return;
  }

  @Get(':categoryId')
  @HttpCode(200)
  fetchPostsById(
    @Param('categoryId') categoryId: number,
  ) {
    return;
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
  deleteCategoryById(
    @Param('categoryId') categoryId: number,
  ) {
    return;
  }
}

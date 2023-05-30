import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from '@nestjs/common';
import { UpdatePostDto } from './dto/update-post.dto';
import { CreatePostDto } from './dto/create-post.dto';

@Controller('posts')
export class PostsController {
  @Get()
  @HttpCode(200)
  getPostPreviews() {

  }

  @Post()
  @HttpCode(201)
  createPost(
    @Body() createPostDto: CreatePostDto,
  ) {

  }

  @Get(':post_uuid')
  @HttpCode(200)
  getPostByUuid(
    @Param('post_uuid') postUuid: string,
  ) {
    return;
  }

  @Patch(':post_uuid')
  @HttpCode(200)
  updatePostByUuid(
    @Param('post_uuid') postUuid: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return;
  }

  @Delete(':post_uuid')
  @HttpCode(204)
  deletePostByUuid(
    @Param('post_uuid') postUuid: string,
  ) {
    return;
  }
}

import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { UpdatePostDto } from './dto/update-post.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
  ) { }

  @Get()
  @HttpCode(200)
  async getPostPreviews(
    @Query('offset', new ParseIntPipe({ errorHttpStatusCode: 406 })) offset: number,
  ) {
    const posts = await this.postsService.getPosts(offset);
    return posts;
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

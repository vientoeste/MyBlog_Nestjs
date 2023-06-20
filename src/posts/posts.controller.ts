import { Body, Controller, DefaultValuePipe, Delete, Get, HttpCode, Param, ParseIntPipe, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
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
    @Query('offset', new DefaultValuePipe(0), new ParseIntPipe({ errorHttpStatusCode: 406 })) offset: number,
  ) {
    const posts = await this.postsService.getPosts(offset);
    return posts;
  }

  @Post()
  @HttpCode(201)
  async createPost(
    @Body() createPostDto: CreatePostDto,
  ) {
    await this.postsService.createPost(createPostDto);
  }

  @Get(':post_uuid')
  @HttpCode(200)
  async getPostByUuid(
    @Param('post_uuid', new ParseUUIDPipe({ errorHttpStatusCode: 406 })) postUuid: string,
  ) {
    const post = await this.postsService.getPostByUUID(postUuid);
    return post;
  }

  @Patch(':post_uuid')
  @HttpCode(200)
  async updatePostByUuid(
    @Param('post_uuid') postUuid: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    await this.postsService.updatePost(updatePostDto, postUuid);
    return;
  }

  @Delete(':post_uuid')
  @HttpCode(204)
  async deletePostByUuid(
    @Param('post_uuid') postUuid: string,
  ) {
    await this.postsService.deletePostByUUID(postUuid);
    return;
  }
}

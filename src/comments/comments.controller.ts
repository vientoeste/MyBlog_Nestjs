import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('posts/:post_uuid/comments')
export class CommentsController {
  @Get()
  @HttpCode(200)
  getCommentsByPostUuid(
    @Param('post_uuid') postUuid: string,
  ) {
    return;
  }

  @Post()
  @HttpCode(201)
  createComment(
    @Param('post_uuid') postUuid: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return;
  }

  @Patch(':comment_uuid')
  @HttpCode(200)
  updateCommentByUuid(
    @Param('post_uuid') postUuid: string,
    @Param('comment_uuid') commentUuid: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return;
  }

  @Delete(':comment_uuid')
  @HttpCode(204)
  deleteCommentByUuid(
    @Param('post_uuid') postUuid: string,
    @Param('comment_uuid') commentUuid: string,
  ) {
    return;
  }
}

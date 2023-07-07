import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentsService } from './comments.service';
import { AuthService } from 'src/auth/auth.service';
import { RequestWithUser } from 'src/common/user.interface';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('posts/:post_uuid/comments')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly authService: AuthService,
  ) { }

  @Get()
  @HttpCode(200)
  async getCommentsByPostUuid(
    @Param('post_uuid') postUuid: string,
  ) {
    const comments = await this.commentsService.getCommentsByPostUuid(postUuid);
    return comments;
  }

  @Post()
  @UseGuards(AuthGuard)
  @HttpCode(201)
  async createComment(
    @Param('post_uuid') postUuid: string,
    @Body() createCommentDto: CreateCommentDto,
    @Request() req: RequestWithUser,
  ) {
    await this.commentsService.createComment(postUuid, createCommentDto, req.payload.userUuid);
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

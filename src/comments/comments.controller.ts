import { BadRequestException, Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Put, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentsService } from './comments.service';
import { AuthService } from 'src/auth/auth.service';
import { RequestWithUser } from 'src/common/user.interface';
import { AuthGuard } from 'src/auth/auth.guard';
import { PatchValidationPipe } from 'src/common/pipes/patch-validation.pipe';

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

  @Put(':comment_uuid')
  @UseGuards(AuthGuard)
  @HttpCode(200)
  async updateCommentByUuid(
    @Param('post_uuid') postUuid: string,
    @Param('comment_uuid') commentUuid: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @Request() req: RequestWithUser,
  ) {
    if (Object.keys(updateCommentDto).length !== 1 && !updateCommentDto.content) {
      throw new BadRequestException();
    }
    await this.commentsService.updateComment(commentUuid, updateCommentDto, req.payload.userUuid);
    return;
  }

  @Delete(':comment_uuid')
  @UseGuards(AuthGuard)
  @HttpCode(204)
  deleteCommentByUuid(
    @Param('post_uuid') postUuid: string,
    @Param('comment_uuid') commentUuid: string,
  ) {
    return;
  }
}

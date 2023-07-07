import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentEntity } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { createUUID, getDateForDb } from 'src/common/util';
import { ResultSetHeader } from 'mysql2';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentEntity)
    private commentsRepository: Repository<CommentEntity>,
  ) { }

  async getCommentsByPostUuid(postUuid: string) {
    const comments = await this.commentsRepository.find({
      where: {
        post_uuid: postUuid,
      },
    });
    if (!comments) {
      throw new NotFoundException();
    }
    return comments;
  }

  async createComment(
    postUuid: string,
    commentDto: CreateCommentDto,
    userUuid: string,
  ) {
    const now = getDateForDb();
    const res = await this.commentsRepository.insert({
      uuid: createUUID(userUuid.concat(commentDto.content, now)),
      content: commentDto.content,
      post_uuid: postUuid,
      user_uuid: userUuid,
      created_at: now,
    });
    const { affectedRows } = res.raw as ResultSetHeader;
    if (!affectedRows) {
      throw new InternalServerErrorException();
    }
    return;
  }
}

import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentEntity } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { createUUID, getDateForDb } from 'src/common/util';
import { ResultSetHeader } from 'mysql2';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentHistoryEntity } from './entities/comment_history.entity';
import { NotUpdatedException } from 'src/common/exception';
import { historyMonitor } from 'src/main';
import { CommentDTO } from './dto/get-comment';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentEntity)
    private commentsRepository: Repository<CommentEntity>,
    @InjectRepository(CommentHistoryEntity)
    private commentHistoryRepository: Repository<CommentHistoryEntity>,
  ) { }

  async getCommentsByPostUuid(postUuid: string): Promise<CommentDTO[]> {
    const comments = await this.commentsRepository.find({
      where: {
        post_uuid: postUuid,
      },
    });
    if (!comments) {
      throw new NotFoundException();
    }
    return comments.map((comment) => ({
      uuid: comment.uuid,
      postUuid: comment.post_uuid,
      userUuid: comment.user_uuid,
      content: comment.content,
      createdAt: comment.created_at,
      updatedAt: comment.updated_at,
    }));
  }

  async createComment(
    postUuid: string,
    commentDto: CreateCommentDto,
    userUuid: string,
  ): Promise<void> {
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

  async updateComment(
    commentUuid: string,
    commentDto: UpdateCommentDto,
    userUuid: string,
  ): Promise<void> {
    const comment = await this.commentsRepository.findOne({
      where: {
        uuid: commentUuid,
        is_deleted: false,
      },
    });
    if (!comment) {
      throw new NotFoundException();
    }
    if (comment.user_uuid !== userUuid) {
      throw new ForbiddenException();
    }

    const commentHistoryObjToStore = {
      comment_uuid: comment.uuid,
      content: comment.content,
      user_uuid: userUuid,
    };

    const { affected } = await this.commentsRepository.update({
      uuid: commentUuid,
    }, {
      content: commentDto.content,
    });
    if (affected !== 1) {
      throw new NotUpdatedException();
    }

    this.commentHistoryRepository.insert(commentHistoryObjToStore)
      .then((v: { raw: ResultSetHeader }) => {
        if (v.raw.affectedRows !== 1) {
          historyMonitor.insertFailedJob(commentHistoryObjToStore as Record<string, unknown>);
          throw new InternalServerErrorException();
        }
      })
      .catch((e) => {
        console.error(e);
        historyMonitor.insertFailedJob(commentHistoryObjToStore as Record<string, unknown>);
      });
  }

  async deleteComment(
    commentUuid: string,
    userUuid: string,
  ): Promise<void> {
    const comment = await this.commentsRepository.findOne({
      where: {
        uuid: commentUuid,
      },
    });
    if (!comment) {
      throw new NotFoundException();
    }
    if (userUuid !== comment.user_uuid) {
      throw new ForbiddenException();
    }

    const { affected } = await this.commentsRepository.update({
      uuid: commentUuid,
    }, {
      is_deleted: true,
    });
    if (affected !== 1) {
      throw new InternalServerErrorException();
    }

    const commentHistoryObjToStore = {
      comment_uuid: commentUuid,
      content: comment.content,
      user_uuid: userUuid,
      post_uuid: comment.post_uuid,
      deleted_at: getDateForDb(),
    };
    this.commentHistoryRepository.insert(commentHistoryObjToStore)
      .then((v: { raw: ResultSetHeader }) => {
        if (v.raw.affectedRows !== 1) {
          throw new InternalServerErrorException();
        }
      })
      .catch(() => {
        historyMonitor.insertFailedJob(commentHistoryObjToStore);
      });
  }
}

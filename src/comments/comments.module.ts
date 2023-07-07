import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from './entities/comment.entity';
import { CommentsService } from './comments.service';
import { CommentHistoryEntity } from './entities/comment_history.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommentEntity]),
    TypeOrmModule.forFeature([CommentHistoryEntity]),
  ],
  providers: [CommentsService],
})
export class CommentsModule { }

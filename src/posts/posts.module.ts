import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';
import { PostHistoryEntity } from './entities/post_history.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([PostEntity]),
        TypeOrmModule.forFeature([PostHistoryEntity]),
    ],
    providers: [PostsService],
})
export class PostsModule { }

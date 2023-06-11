import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';

@Module({
    imports: [TypeOrmModule.forFeature([PostEntity])],
    providers: [PostsService],
})
export class PostsModule { }

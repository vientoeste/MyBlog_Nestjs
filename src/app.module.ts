import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsController } from './posts/posts.controller';
import { CategoriesController } from './categories/categories.controller';
import { CommentsController } from './comments/comments.controller';

@Module({
  imports: [],
  controllers: [AppController, PostsController, CategoriesController, CommentsController],
  providers: [AppService],
})
export class AppModule { }

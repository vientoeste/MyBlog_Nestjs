import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsController } from './posts/posts.controller';
import { CategoriesController } from './categories/categories.controller';
import { CommentsController } from './comments/comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`${__dirname}/config/env/.${process.env.NODE_ENV}.env`],
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      username: process.env.MYSQL_ID,
      password: process.env.MYSQL_PW,
      database: process.env.MYSQL_DB,
      port: parseInt(String(process.env.MYSQL_PORT)),
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,
    }),
  ],
  controllers: [AppController, PostsController, CategoriesController, CommentsController],
  providers: [AppService],
})
export class AppModule { }

import { Module } from '@nestjs/common';
import { PostsController } from './posts/posts.controller';
import { CategoriesController } from './categories/categories.controller';
import { CommentsController } from './comments/comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersController } from './users/users.controller';
import { AuthService } from './auth/auth.service';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { UserEntity } from './users/entities/user.entity';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { JwtInterceptor } from './interceptor/jwt.interceptor';
import { PostsModule } from './posts/posts.module';
import { PostsService } from './posts/posts.service';
import { PostEntity } from './posts/entities/post.entity';
import { PostHistoryEntity } from './posts/entities/post_history.entity';
import { MonitorController } from './monitor/monitor.controller';
import { CategoriesService } from './categories/categories.service';
import { CategoryEntity } from './categories/entities/category.entity';
import { CategoryHistoryEntity } from './categories/entities/category_history.entity';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    UsersModule, AuthModule,
    ConfigModule.forRoot({
      envFilePath: [`.${process.env.NODE_ENV}.env`],
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
    TypeOrmModule.forFeature([UserEntity]),
    TypeOrmModule.forFeature([PostEntity]),
    TypeOrmModule.forFeature([PostHistoryEntity]),
    TypeOrmModule.forFeature([CategoryEntity]),
    TypeOrmModule.forFeature([CategoryHistoryEntity]),
    PostsModule,
    CategoriesModule,
  ],
  controllers: [
    PostsController, CategoriesController,
    CommentsController, UsersController, MonitorController,
  ],
  providers: [
    UsersService, AuthService,
    PostsService,
    {
      provide: APP_INTERCEPTOR,
      useClass: JwtInterceptor,
    },
    CategoriesService,
  ],
})
export class AppModule { }

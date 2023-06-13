import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';
import { Repository } from 'typeorm';
import { NoMoreContentError } from 'src/common/error';
import { CreatePostDto } from './dto/create-post.dto';
import { createUUID, getDateForDb } from 'src/common/util';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private postsRepository: Repository<PostEntity>,
  ) { }

  async getPosts(offset: number) {
    const posts = await this.postsRepository.find({
      where: {
        is_deleted: false,
      },
      skip: offset * 20,
      take: 20,
    });
    if (Array.isArray(posts) && posts.length === 0) {
      throw new NoMoreContentError('No more content available');
    }
    if (!posts) {
      throw new InternalServerErrorException('query failed');
    }
    return posts;
  }

  async createPost(createPostDto: CreatePostDto) {
    const now = getDateForDb();
    await this.postsRepository.insert({
      uuid: createUUID(createPostDto.title.concat(now)),
      title: createPostDto.title,
      content: createPostDto.content,
      category_id: createPostDto.categoryId,
      created_at: now,
    });
  }

  async getPostByUUID(uuid: string) {
    const post = await this.postsRepository.findOneBy({
      uuid,
      is_deleted: false,
    });
    if (!post) {
      throw new NotFoundException();
    }
    return post;
  }
}

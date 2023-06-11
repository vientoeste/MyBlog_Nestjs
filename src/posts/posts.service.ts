import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';
import { Repository } from 'typeorm';
import { NoMoreContentError } from 'src/common/error';

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
}

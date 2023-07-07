import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';
import { Repository } from 'typeorm';
import { NoMoreContentException, NotUpdatedException } from 'src/common/exception';
import { CreatePostDto } from './dto/create-post.dto';
import { createUUID, getDateForDb } from 'src/common/util';
import { PostHistoryEntity } from './entities/post_history.entity';
import { ResultSetHeader } from 'mysql2';
import { historyMonitor } from 'src/main';
import { UpdatePostDto } from './dto/update-post.dto';
import { FetchPostDTO, PostDTO } from './dto/get-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private postsRepository: Repository<PostEntity>,
    @InjectRepository(PostHistoryEntity)
    private postHistoriesRepository: Repository<PostHistoryEntity>,
  ) { }

  async getPosts(offset: number) {
    const posts = await this.postsRepository.find({
      select: ['uuid', 'title', 'content', 'category_id', 'created_at', 'updated_at'],
      where: {
        is_published: true,
        is_deleted: false,
      },
      skip: offset * 20,
      take: 20,
    });
    if (Array.isArray(posts) && posts.length === 0) {
      throw new NoMoreContentException('No more content available');
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

  async getPostByUUID(uuid: string): Promise<PostDTO> {
    const post: FetchPostDTO[] = await this.postsRepository
      .createQueryBuilder('p')
      .select('BIN_TO_UUID(p.uuid)', 'uuid')
      .addSelect('p.title', 'title')
      .addSelect('p.content', 'content')
      .addSelect('p.category_id', 'category_id')
      .addSelect('p.created_at', 'created_at')
      .addSelect('BIN_TO_UUID(c.uuid)', 'comment_uuid')
      .addSelect('u.username', 'username')
      .addSelect('c.content', 'comment')
      .addSelect('c.created_at', 'comment_created_at')
      .addSelect('BIN_TO_UUID(c.user_uuid)', 'user_uuid')
      .innerJoin('comment', 'c', 'p.uuid = c.post_uuid')
      .innerJoin('user', 'u', 'c.user_uuid = u.uuid')
      .where(`c.post_uuid = UUID_TO_BIN('${uuid}')`)
      .andWhere('c.is_deleted = false')
      .getRawMany();

    return {
      uuid: post[0].uuid,
      title: post[0].title,
      content: post[0].content,
      categoryId: post[0].category_id,
      createdAt: post[0].created_at,
      updatedAt: post[0].updated_at,
      comments: post.map(v => ({
        uuid: v.comment_uuid,
        userUuid: v.user_uuid,
        username: v.username,
        content: v.comment,
        createdAt: v.comment_created_at,
      })),
    };
  }

  async deletePostByUUID(uuid: string) {
    // [TODO] needs refactoring to reduce query count
    const post = await this.postsRepository.findOneBy({
      uuid,
    });
    if (!post) {
      throw new NotFoundException('post not found');
    }

    const { affected } = await this.postsRepository.update({ uuid, is_deleted: false }, {
      is_deleted: true,
    });
    if (affected !== 1) {
      console.log('not updated');
      throw new NotUpdatedException();
    }

    const postHistoryObjToStore = {
      post_uuid: post.uuid,
      title: post.title,
      content: post.content,
      category_id: post.category_id,
      deleted_at: getDateForDb(),
    };
    this.postHistoriesRepository.insert(postHistoryObjToStore)
      .then((v: { raw: ResultSetHeader }) => {
        if (v.raw.affectedRows !== 1) {
          throw new InternalServerErrorException();
        }
      })
      .catch(() => {
        historyMonitor.insertFailedJob(postHistoryObjToStore as Record<string, undefined>);
      });
  }

  async updatePost(
    postDto: UpdatePostDto,
    uuid: string,
  ) {
    const post = await this.postsRepository.findOneBy({
      uuid,
      is_published: true,
      is_deleted: false,
    });
    if (!post) {
      throw new NotFoundException();
    }
    const postHistoryObjToStore = {
      post_uuid: post.uuid,
      title: post.title,
      content: post.content,
      category_id: post.category_id,
    };

    await this.postsRepository.update(uuid, postDto);
    this.postHistoriesRepository.insert(postHistoryObjToStore)
      .then((v: { raw: ResultSetHeader }) => {
        if (v.raw.affectedRows !== 1) {
          throw new InternalServerErrorException();
        }
      })
      .catch(() => {
        historyMonitor.insertFailedJob(postHistoryObjToStore as Record<string, unknown>);
      });
  }
}

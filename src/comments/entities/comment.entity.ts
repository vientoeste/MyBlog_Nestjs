import { uuidTransformer } from 'src/common/util';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('comment')
export class CommentEntity {
  @PrimaryColumn({
    type: 'binary',
    length: 16,
    transformer: uuidTransformer,
    generated: 'uuid',
  })
  uuid: string;

  @Column({ length: 8000 })
  content: string;

  @Column({
    type: 'binary',
    length: 16,
    transformer: uuidTransformer,
    generated: 'uuid',
  })
  user_uuid: string;

  @Column({
    type: 'binary',
    length: 16,
    transformer: uuidTransformer,
    generated: 'uuid',
  })
  post_uuid: string;

  @Column({ length: 19 })
  created_at: string;

  @Column({ length: 19 })
  updated_at: string;

  @Column()
  is_deleted: boolean;
}

import { uuidTransformer } from 'src/common/util';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('post_history')
export class PostHistoryEntity {
  @PrimaryColumn({
    type: 'int',
    generated: 'increment',
  })
  id: number;

  @Column({
    type: 'binary',
    length: 16,
    transformer: uuidTransformer,
    foreignKeyConstraintName: 'post_history_ibfk_1',
  })
  post_uuid: string;

  @Column({ length: 60 })
  title: string;

  @Column({ length: 8000 })
  content: string;

  @Column()
  category_id: number;

  @Column({ length: 19 })
  created_at: string;

  @Column()
  is_published: boolean;

  @Column({ length: 19 })
  deleted_at: string;
}

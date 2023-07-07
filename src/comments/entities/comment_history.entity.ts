import { uuidTransformer } from 'src/common/util';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('comment_history')
export class CommentHistoryEntity {
  @PrimaryColumn({
    type: 'int',
    generated: 'increment',
  })
  id: number;

  @Column({
    type: 'binary',
    length: 16,
    transformer: uuidTransformer,
    foreignKeyConstraintName: 'comment_history_ibfk_1',
  })
  comment_uuid: string;

  @Column({ length: 8000 })
  content: string;

  @Column({
    type: 'binary',
    length: 16,
    transformer: uuidTransformer,
    foreignKeyConstraintName: 'comment_history_ibfk_2',
  })
  user_uuid: string;

  @Column({ length: 19 })
  created_at: string;

  @Column({ length: 19 })
  deleted_at: string;
}

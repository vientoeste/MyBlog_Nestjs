import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('category_history')
export class CategoryHistoryEntity {
  @PrimaryColumn({
    type: 'int',
    generated: 'increment',
  })
  id: number;

  @Column({
    type: 'int',
    foreignKeyConstraintName: 'category_history_ibfk_1',
  })
  category_id: number;

  @Column({ length: 60 })
  name: string;

  @Column({ length: 8000 })
  description: string;

  @Column({ length: 19 })
  created_at: string;

  @Column({ length: 19 })
  deleted_at: string;
}

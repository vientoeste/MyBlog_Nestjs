import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('post')
export class PostEntity {
  @PrimaryColumn()
  uuid: string;

  @Column({ length: 60 })
  title: string;

  @Column({ length: 8000 })
  content: string;

  @Column({ length: 5 })
  category_id: string;

  @Column({ length: 19 })
  created_at: string;

  @Column({ length: 19 })
  updated_at: string;

  @Column()
  is_published: boolean;

  @Column()
  is_deleted: boolean;
}

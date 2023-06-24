import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('category')
export class CategoryEntity {
  @PrimaryColumn({ type: 'int' })
  id: number;

  @Column({ length: 60 })
  name: string;

  @Column({ length: 8000 })
  description: string;

  @Column({ length: 19 })
  created_at: string;

  @Column({ length: 19 })
  updated_at: string;

  @Column()
  is_deleted: boolean;
}

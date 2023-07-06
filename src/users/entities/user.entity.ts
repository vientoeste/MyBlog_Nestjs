import { uuidTransformer } from 'src/common/util';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('user')
export class UserEntity {
  @PrimaryColumn({
    type: 'binary',
    length: 16,
    transformer: uuidTransformer,
    generated: 'uuid',
  })
  uuid: string;

  @Column({ length: 30 })
  username: string;

  @Column({ length: 30 })
  email: string;

  @Column({ length: 60 })
  password: string;
}

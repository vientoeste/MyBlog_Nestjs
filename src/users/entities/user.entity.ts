import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('User')
export class UserEntity {
  @PrimaryColumn()
  uuid: string;

  @Column({ length: 30 })
  name: string;

  @Column({ length: 30 })
  email: string;

  @Column({ length: 60 })
  password: string;

  @Column({ length: 60 })
  signupVerifyToken: string;
}

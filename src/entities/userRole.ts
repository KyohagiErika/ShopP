import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user';
import { RoleEnum } from '../utils/shopp.enum';

@Entity()
export class UserRole {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, user => user.role)
  @JoinColumn()
  user: User;

  @Column({
    type: 'enum',
    enum: RoleEnum,
  })
  role: RoleEnum;
}

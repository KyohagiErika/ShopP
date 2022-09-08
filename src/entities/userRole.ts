import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user';
import { RoleEnum } from '../utils/shopp.enum';

@Entity()
export class UserRole {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.roles)
  user: User;

  @Column({
    type: 'enum',
    enum: RoleEnum,
  })
  role: RoleEnum;
}

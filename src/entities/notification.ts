import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { RoleEnum } from '../utils/shopp.enum';
import { LocalFile } from './localFile';
import { User } from './user';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @OneToOne(() => LocalFile)
  @JoinColumn()
  image: LocalFile;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToMany(() => User, receivers => receivers.notifications)
  @JoinTable()
  receivers: User[];

  @Column({
    type: 'enum',
    enum: RoleEnum,
    default: RoleEnum.CUSTOMER,
  })
  roleReceiver: RoleEnum;
}

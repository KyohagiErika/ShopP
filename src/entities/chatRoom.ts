import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { StatusEnum } from '../utils/shopp.enum';
import { Message } from './message';
import { User } from './user';

@Entity()
export class ChatRoom {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: StatusEnum,
    default: StatusEnum.ACTIVE,
  })
  status: StatusEnum;

  @OneToMany(() => Message, messages => messages.chatRoom)
  messages: Message[];

  @ManyToMany(() => User, members => members.chatRooms)
  members: User[];
}

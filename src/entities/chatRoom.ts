import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { StatusEnum } from '../utils/shopp.enum';
import { Customer } from './customer';
import { Message } from './message';
import { Shop } from './shop';

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

  @ManyToOne(() => Shop, shop => shop.chatRooms)
  shop: Shop;

  @ManyToOne(() => Customer, customer => customer.chatRooms)
  customer: Customer;
}

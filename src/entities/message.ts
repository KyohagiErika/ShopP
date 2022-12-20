import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { TypeTransferEnum } from '../utils/shopp.enum';
import { ChatRoom } from './chatRoom';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @Column({
    type: 'enum',
    enum: TypeTransferEnum,
    default: TypeTransferEnum.CUSTOMER_TO_SHOP,
  })
  roleSender: TypeTransferEnum;

  @ManyToOne(() => ChatRoom, chatRoom => chatRoom.messages)
  chatRoom: ChatRoom;
}

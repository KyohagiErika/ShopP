import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { TypeTransferEnum } from '../utils/shopp.enum';
import { ChatRoom } from './chatRoom';

/**
 * @swagger
 * components:
 *  schemas:
 *   MessageResponse:
 *    type: object
 *    properties:
 *     id:
 *      type: integer
 *      description: id of the message
 *      example: '1'
 *     text:
 *      type: string
 *      description: text of the message
 *      example: 'hello'
 *     createdAt:
 *      type: string
 *      format: date-time
 *      description: date of the message
 *      example: '2017-07-21T17:32:28Z'
 *     roleSender:
 *      $ref: '#/components/schemas/TypeTransferEnum'
 *   MessageListResponse:
 *    type: array
 *    items:
 *     $ref: '#/components/schemas/MessageResponse'
 */
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

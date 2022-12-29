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

/**
 * @swagger
 * components:
 *  schemas:
 *   ChatRoomResponse:
 *    type: object
 *    properties:
 *     id:
 *      type: integer
 *      description: id of the chatroom
 *      example: '1'
 *   CustomerChatRoomResponse:
 *    type: object
 *    properties:
 *     id:
 *      type: integer
 *      description: id of the chatroom
 *      example: '1'
 *     shop:
 *      $ref: '#/components/schemas/ShopResponse'
 *   CustomerChatRoomListResponse:
 *    type: array
 *    items:
 *     $ref: '#/components/schemas/CustomerChatRoomResponse'
 *   ShopChatRoomResponse:
 *    type: object
 *    properties:
 *     id:
 *      type: integer
 *      description: id of the chatroom
 *      example: '1'
 *     customer:
 *      $ref: '#/components/schemas/CustomerResponse'
 *   ShopChatRoomListResponse:
 *    type: array
 *    items:
 *     $ref: '#/components/schemas/ShopChatRoomResponse'
 */
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

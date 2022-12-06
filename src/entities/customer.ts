import { Evaluation } from './evaluation';
import { Shop } from './shop';
import { Voucher } from './voucher';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import { User } from './user';
import { GenderEnum } from '../utils/shopp.enum';
import { Cart } from './cart';
import { LocalFile } from './localFile';
import { Report } from './report';
import { Order } from './order';
import { ChatRoom } from './chatRoom';

/**
 * @swagger
 * components:
 *  schemas:
 *   CustomerResponse:
 *    type: object
 *    properties:
 *     id:
 *      type: integer
 *      format: uuid
 *      description: id of the customer
 *      example: '7039afb2-b5c4-4fe3-a48e-dcdcb7fc5ed5'
 *     name:
 *      type: string
 *      description: name of the customer
 *      example: 'bello'
 *     gender:
 *      type: string
 *      description: gender of the customer
 *      example: 'MALE'
 *     dob:
 *      type: string
 *      description: Date of birth
 *      example: '22-03-2003'
 *     placeOfDelivery:
 *      type: string
 *      description: place of delivery
 *      example: '34 Nguyen Van Cu, Ha Noi'
 *     avatar:
 *      $ref: '#/components/schemas/LocalFileResponse'
 *     bio:
 *      type: string
 *      description: bio of the customer
 *      example: 'nha giau, hoc gioi'
 *   CustomerListResponse:
 *    type: array
 *    items:
 *     $ref: '#/components/schemas/CustomerResponse'
 *   FollowedShopsResponse:
 *    type: array
 *    items:
 *     type: object
 *     properties:
 *      id:
 *       type: string
 *       format: uuid
 *       description: id of the shop
 *       example: '7039afb2-b5c4-4fe3-a48e-dcdcb7fc5ed5'
 *      name:
 *       type: string
 *       description: name of the shop
 *       example: 'bello'
 *      star:
 *       type: number
 *       format: double
 *       description: star of the shop
 *       example: 4.5
 */
@Entity()
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToOne(() => LocalFile)
  @JoinColumn()
  avatar: LocalFile;

  @Column({
    type: 'enum',
    enum: GenderEnum,
    default: GenderEnum.MALE,
  })
  gender: GenderEnum;

  @Column({ nullable: true })
  dob: Date;

  @OneToOne(() => User, user => user.customer)
  @JoinColumn()
  user: User;

  @Column()
  placeOfDelivery: string;

  @Column({
    nullable: true,
    default: '',
  })
  bio: string;

  @OneToOne(() => Cart, cart => cart.customer)
  cart: Cart;

  @ManyToMany(() => Voucher, voucher => voucher.customer)
  voucher: Voucher[];

  @OneToMany(() => Report, report => report.id)
  report: Report[];

  @OneToMany(() => Order, order => order.id)
  order: Order[];

  @ManyToMany(() => Shop, shop => shop.followers)
  @JoinTable()
  shopsFollowed: Shop[];

  @OneToMany(() => ChatRoom, chatRooms => chatRooms.customer)
  @JoinTable()
  chatRooms: ChatRoom[];
  
  @ManyToMany(() => Evaluation, evaluation => evaluation.likedPeople)
  likedEvaluations: Evaluation[];
}

import { Customer } from './customer';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { LocalFile } from './localFile';
import { OrderProduct } from './orderProduct';
import { Order } from './order';
import { Product } from './product';
import { Report } from './report';
import { User } from './user';

/**
 * @swagger
 * components:
 *  schemas:
 *   ShopResponse:
 *    type: object
 *    properties:
 *     id:
 *      type: integer
 *      format: uuid
 *      description: id of the shop
 *      example: '6e8efe7d-d9f2-4191-be9c-4fedb551da99'
 *     name:
 *      type: string
 *      description: name of the shop
 *      example: 'bello'
 *     email:
 *      type: string
 *      description: email of the shop
 *      example: 'shopp123@gmail.com'
 *     phone:
 *      type: string
 *      description: phone of the shop
 *      example: '0987654321'
 *     placeOfReceipt:
 *      type: object
 *      description: place of receipt
 *     star:
 *      type: number
 *      format: double
 *      description: average star
 *     followersNumber:
 *      type: integer
 *      format: int32
 *      description: number of followers
 *     avatar:
 *      $ref: '#/components/schemas/LocalFileResponse'
 *   ShopListResponse:
 *    type: array
 *    items:
 *     $ref: '#/components/schemas/ShopResponse'
 */
@Entity()
export class Shop {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToOne(() => LocalFile)
  @JoinColumn()
  avatar: LocalFile;

  @OneToOne(() => User, user => user.shop)
  @JoinColumn()
  user: User;

  @OneToMany(() => Product, product => product.shop)
  products: Product[];

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  placeOfReceipt: string;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  star: number;

  @Column({ default: 0 })
  followersNumber: number;

  @OneToMany(() => Report, report => report.id)
  report: Report[];

  @OneToMany(() => Order, order => order.id)
  order: Order[];

  @ManyToMany(() => Customer, customer => customer.shopsFollowed)
  followers: Customer[];
}

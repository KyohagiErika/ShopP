import { Voucher } from './voucher';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  OneToOne,
  ManyToMany,
} from 'typeorm';

import bcrypt from 'bcryptjs';
import { UserRole } from './userRole';
import { Customer } from './customer';
import { StatusEnum } from '../utils/shopp.enum';
import { Shop } from './shop';
import { Event } from './event';
import { Notification } from './notification';

/**
 * @swagger
 * components:
 *  schemas:
 *   UserResponse:
 *    type: object
 *    properties:
 *     id:
 *      type: integer
 *      format: int32
 *      description: id of the user
 *      example: '1'
 *     email:
 *      type: string
 *      description: email of the user
 *      example: 'shopp123@gmail.com'
 *     phone:
 *      type: string
 *      description: phone of the user
 *      example: '0987654321'
 *     role:
 *      type: object
 *      description: role of the user
 *     shop:
 *      type: object
 *      description: shop information of the user
 *     customer:
 *      type: object
 *      description: customer information of the user
 */
/**
 * @swagger
 * components:
 *  schemas:
 *   UserListResponse:
 *    type: array
 *    items:
 *     $ref: '#/components/schemas/UserResponse'
 */
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: StatusEnum,
    default: StatusEnum.ACTIVE,
  })
  status: StatusEnum;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  lockedAt: Date;

  @OneToOne(() => UserRole, userRole => userRole.user)
  role: UserRole;

  @OneToOne(() => Shop, shop => shop.user)
  shop: Shop;

  @OneToOne(() => Customer, customer => customer.user)
  customer: Customer;

  @OneToMany(() => Event, event => event.createdBy)
  event: Event[];

  @OneToMany(() => Voucher, voucher => voucher.createdBy)
  voucher: Voucher[];

  @ManyToMany(() => Notification, notifications => notifications.receivers)
  notifications: Notification[];

  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 8);
  }

  checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
    return bcrypt.compareSync(unencryptedPassword, this.password);
  }
}

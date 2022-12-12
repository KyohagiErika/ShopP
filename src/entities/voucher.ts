import { RoleEnum } from './../utils/shopp.enum';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from 'typeorm';
import { User } from './user';
import { VoucherTypeEnum } from '../utils/shopp.enum';
import { Customer } from './customer';
import { Order } from './order';
import { VoucherCustomerResponse } from '../interfaces/voucher';

/**
 * @swagger
 * components:
 *  schemas:
 *   VoucherResponse:
 *    type: object
 *    properties:
 *     id:
 *      type: string
 *      description: id of voucher
 *      example: f191d8ad-3d10-4681-9b14-95d8de1e61e1
 *     title:
 *      type: string
 *      description: title of voucher
 *      example: Tat ca hinh thuc thanh toan
 *     type:
 *      type: string
 *      description: type of voucher
 *      example: Freeship
 *     condition:
 *      type: string
 *      description: condition of voucher
 *      example: Freeship
 *     mfgDate:
 *      type: string
 *      description: start day of voucher
 *      format: date
 *      example: 2022-10-29
 *     expDate:
 *      type: string
 *      description: expire day of voucher
 *      format: date
 *      example: 2022-11-29
 *   VoucherListResponse:
 *    type: array
 *    items:
 *     $ref: '#/components/schemas/VoucherResponse'
 */
@Entity()
export class Voucher {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({
    type: 'enum',
    enum: VoucherTypeEnum,
  })
  type: VoucherTypeEnum;

  @Column({
    type: 'enum',
    enum: RoleEnum,
  })
  roleCreator: RoleEnum;

  @ManyToOne(() => User, user => user.voucher)
  createdBy: User;

  @Column()
  amount: number;

  @Column('json', { nullable: true })
  condition: string;

  @Column()
  mfgDate: Date;

  @Column()
  expDate: Date;

  @ManyToMany(() => Customer, customer => customer.voucher)
  @JoinTable()
  customer: Customer[];

  @ManyToMany(() => Order, order => order.id)
  order: Order[];

  static mapVoucher(voucherEntity: Voucher): VoucherCustomerResponse {
    return {
      id: voucherEntity.id,
      title: voucherEntity.title,
      type: voucherEntity.type,
      condition: voucherEntity.condition,
      mfgDate: voucherEntity.mfgDate,
      expDate: voucherEntity.expDate,
    };
  }
}

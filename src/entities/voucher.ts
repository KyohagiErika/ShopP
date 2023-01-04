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
 *      $ref: '#/components/schemas/VoucherTypeEnum'
 *     minBillPrice:
 *      type: integer
 *      description: minimum price of Bill that can apply
 *      example: 100000
 *     priceDiscount:
 *      type: integer
 *      description: price discount of voucher
 *      example: 50
 *     maxPriceDiscount:
 *      type: integer
 *      description: maximum price discount of voucher
 *      example: 20000
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

  // @Column( { nullable: true })
  // condition: string;

  @Column()
  minBillPrice: number;

  @Column()
  priceDiscount: number;

  @Column()
  maxPriceDiscount: number;

  @Column()
  mfgDate: Date;

  @Column()
  expDate: Date;

  @ManyToMany(() => Customer, customer => customer.voucher)
  @JoinTable()
  customer: Customer[];

  static mapVoucher(voucherEntity: Voucher): VoucherCustomerResponse {
    return {
      id: voucherEntity.id,
      title: voucherEntity.title,
      type: voucherEntity.type,
      minBillPrice: voucherEntity.minBillPrice,
      priceDiscount: voucherEntity.priceDiscount,
      maxPriceDiscount: voucherEntity.maxPriceDiscount,
      mfgDate: voucherEntity.mfgDate,
      expDate: voucherEntity.expDate,
    };
  }
}

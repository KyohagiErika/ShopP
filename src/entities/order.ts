import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DeliveryStatusEnum, StatusEnum } from '../utils/shopp.enum';
import { Customer } from './customer';
import { OrderProduct } from './orderProduct';
import { Payment } from './payment';
import { Shop } from './shop';
import { ShoppingUnit } from './shoppingUnit';
import { Voucher } from './voucher';

/**
 * @swagger
 * components:
 *  schemas:
 *   CustomerOrderResponse:
 *    type: object
 *    properties:
 *     id:
 *      type: string
 *      format: uuid
 *      description: id of the order
 *      example: '7039afb2-b5c4-4fe3-a48e-dcdcb7fc5ed5'
 *     createdAt:
 *      type: string
 *      format: date-time
 *      description: DateTime of the order
 *      example: "2021-01-30T08:30:00Z"
 *     deliveryStatus:
 *      $ref: '#/components/schemas/DeliveryStatusEnum'
 *     address:
 *      type: string
 *      description: address of delivery
 *      example: 'Thu Duc District, TP Ho Chi Minh'
 *     estimateDeliveryTime:
 *      type: string
 *      description: Estimated Delivery Time of the order
 *      example: 'From 12/01/2022 to 15/01/2022'
 *     totalBill:
 *      type: number
 *      format: int64
 *      description: total bill of the order
 *      example: 300000
 *     transportFee:
 *      type: number
 *      format: int64
 *      description: transport fee of the order
 *      example: 20000
 *     totalPayment:
 *      type: number
 *      format: int64
 *      description: total payment of the order
 *      example: 320000
 *     payment:
 *      $ref: '#/components/schemas/PaymentResponse'
 *     shoppingUnit:
 *      $ref: '#/components/schemas/ShoppingUnitResponse'
 *     voucher:
 *      $ref: '#/components/schemas/VoucherListResponse'
 *     shop:
 *      $ref: '#/components/schemas/ShopResponse'
 *   CustomerOrderListResponse:
 *    type: array
 *    items:
 *     $ref: '#/components/schemas/CustomerOrderResponse'
 *   ShopOrderResponse:
 *    type: object
 *    properties:
 *     id:
 *      type: string
 *      format: uuid
 *      description: id of the order
 *      example: '7039afb2-b5c4-4fe3-a48e-dcdcb7fc5ed5'
 *     createdAt:
 *      type: string
 *      format: date-time
 *      description: DateTime of the order
 *      example: "2021-01-30T08:30:00Z"
 *     deliveryStatus:
 *      $ref: '#/components/schemas/DeliveryStatusEnum'
 *     address:
 *      type: string
 *      description: address of delivery
 *      example: 'Thu Duc District, TP Ho Chi Minh'
 *     estimateDeliveryTime:
 *      type: string
 *      description: Estimated Delivery Time of the order
 *      example: 'From 12/01/2022 to 15/01/2022'
 *     totalBill:
 *      type: number
 *      format: int64
 *      description: total bill of the order
 *      example: 300000
 *     transportFee:
 *      type: number
 *      format: int64
 *      description: transport fee of the order
 *      example: 20000
 *     totalPayment:
 *      type: number
 *      format: int64
 *      description: total payment of the order
 *      example: 320000
 *     payment:
 *      $ref: '#/components/schemas/PaymentResponse'
 *     shoppingUnit:
 *      $ref: '#/components/schemas/ShoppingUnitResponse'
 *     voucher:
 *      $ref: '#/components/schemas/VoucherListResponse'
 *     customer:
 *      $ref: '#/components/schemas/CustomerResponse'
 *   ShopOrderListResponse:
 *    type: array
 *    items:
 *     $ref: '#/components/schemas/ShopOrderResponse'
 */
@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({
    type: 'enum',
    enum: DeliveryStatusEnum,
    default: DeliveryStatusEnum.CHECKING,
  })
  deliveryStatus: DeliveryStatusEnum;

  @Column()
  address: string;

  @Column()
  estimateDeliveryTime: string;

  @Column()
  totalBill: number;

  @Column()
  transportFee: number;

  @Column()
  totalPayment: number;

  @Column({
    type: 'enum',
    enum: StatusEnum,
    default: StatusEnum.ACTIVE,
  })
  status: StatusEnum;

  @ManyToOne(() => Payment, payment => payment.id)
  payment: Payment;

  @ManyToOne(() => ShoppingUnit, shoppingUnit => shoppingUnit.id)
  shoppingUnit: ShoppingUnit;

  @ManyToMany(() => Voucher, voucher => voucher.id)
  @JoinTable()
  voucher: Voucher[];

  @ManyToOne(() => Shop, shop => shop.id)
  shop: Shop;

  @ManyToOne(() => Customer, customer => customer.id)
  customer: Customer;

  @OneToMany(type => OrderProduct, orderProduct => orderProduct.orderNumber, {
    cascade: ['insert'],
  })
  orderProducts: OrderProduct[];
}

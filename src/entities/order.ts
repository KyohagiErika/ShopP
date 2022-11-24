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

import { Evaluation } from './evaluation';
import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './order';
import { Product } from './product';

@Entity()
export class OrderProduct {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  price: number;

  @Column()
  additionalInfo: string;

  @ManyToOne(type => Order, orderNumber => orderNumber.orderProducts)
  orderNumber: Order;

  @Column()
  quantity: number;

  @ManyToOne(() => Product, product => product.orderProduct)
  product: Product;

  @OneToOne(() => Evaluation, evaluation => evaluation.orderProduct)
  evaluation: Evaluation;
}

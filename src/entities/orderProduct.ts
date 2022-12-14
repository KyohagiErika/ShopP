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

/**
 * @swagger
 * components:
 *  schemas:
 *   OrderProductResponse:
 *    type: object
 *    properties:
 *     id:
 *      type: string
 *      format: uuid
 *      description: id of the order product
 *      example: '7039afb2-b5c4-4fe3-a48e-dcdcb7fc5ed5'
 *     price:
 *      type: number
 *      format: int64
 *      description: price of the product
 *      example: 32000
 *     additionalInfo:
 *      type: string
 *      description: additional information of the category
 *      example: 'Dep, ngon, bo, re'
 *     quantity:
 *      type: number
 *      format: int64
 *      description: quantity of the order product
 *      example: 3
 *     product:
 *      $ref: '#/components/schemas/ProductResponse'
 *   OrderProductListResponse:
 *    type: array
 *    items:
 *     $ref: '#/components/schemas/OrderProductResponse'
 */
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

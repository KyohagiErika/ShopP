import { Event } from './event';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './product';
import { StatusEnum } from '../utils/shopp.enum';

/**
 * @swagger
 * components:
 *  schemas:
 *   EventProductResponse:
 *    type: object
 *    properties:
 *     id:
 *      type: string
 *      format: uuid
 *      description: id of event product
 *      example: 7723762d-c1ca-4b5d-b294-e705d6c4eb3a
 *     discount:
 *      type: number
 *      format: double
 *      description: discount of event product
 *      example: 0.3
 *     amount:
 *      type: integer
 *      format: int32
 *      description: amount of event product
 *      example: 100
 *     sold:
 *      type: integer
 *      format: int32
 *      description: number of sold event product
 *      example: 20
 *   EventProductListResponse:
 *    type: array
 *    items:
 *     $ref: '#/components/schemas/EventProductResponse'
 */
@Entity()
export class EventProduct {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    default: 0,
    type: 'double',
  })
  discount: number;

  @Column()
  amount: number;

  @Column({
    default: 0,
  })
  sold: number;

  @Column({
    type: 'enum',
    enum: StatusEnum,
    default: StatusEnum.ACTIVE,
  })
  status: StatusEnum;

  @ManyToOne(() => Event, event => event.eventProducts)
  @JoinColumn()
  event: Event;

  @ManyToOne(() => Product, product => product.eventProducts)
  @JoinColumn()
  product: Product;
}

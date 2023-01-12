import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DeliveryStatusEnum, TitleStatusEnum } from '../utils/shopp.enum';
import { Order } from './order';

/**
 * @swagger
 * components:
 *  schemas:
 *   TrackingResponse:
 *    type: object
 *    properties:
 *     id:
 *      type: integer
 *      format: int32
 *      description: id of tracking order
 *      example: '1'
 *     time:
 *      type: string
 *      format: date-time
 *      description: date time of tracking order
 *      example: '2021-01-01T00:00:00.000Z'
 *     title:
 *      $ref: '#/components/schemas/TitleStatusEnum'
 *     deliveryStatus:
 *      $ref: '#/components/schemas/DeliveryStatusEnum'
 *     location:
 *      type: string
 *      description: location of tracking
 *      example: 'Hanoi'
 *     orderNumber:
 *      type: string
 *      format: uuid
 *      description: id of the order
 *      example: '27580e3b-6953-43cc-a482-eaa62b997883'
 *   TrackingListResponse:
 *    type: array
 *    items:
 *     $ref: '#/components/schemas/TrackingResponse'
 */
@Entity()
export class TrackingOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  time: Date;

  @Column({
    type: 'enum',
    enum: TitleStatusEnum,
    default: TitleStatusEnum.ORDER_IS_REPAIRING,
  })
  title: TitleStatusEnum;

  @Column({
    type: 'enum',
    enum: DeliveryStatusEnum,
    default: DeliveryStatusEnum.CONFIRMED,
  })
  deliveryStatus: DeliveryStatusEnum;

  @Column()
  location: string;

  @ManyToOne(() => Order, orderNumber => orderNumber.trackingOrders)
  orderNumber: Order;
}

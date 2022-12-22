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
 *   trackingResponse:
 *    type: object
 *    properties:
 *     id:
 *      type: integer
 *      format: int32
 *      description: id of tracking
 *      example: '1'
 *     time:
 *      type: date
 *      description: date of tracking
 *      example: 'J&T Express'
 *     title:
 *      type: string
 *      description: title of tracking
 *      example: 'J&T Express'
 *     deliveryStatus:
 *      type: string
 *      description: deliveryStatus of tracking
 *      example: 'J&T Express'
 *     location:
 *      type: string
 *      description: location of tracking
 *      example: 'J&T Express'
 *     orderNumber:
 *      $ref: '#/components/schemas/CustomerOrderResponse'
 *   TrackingListResponse:
 *    type: array
 *    items:
 *     $ref: '#/components/schemas/trackingResponse'
 */
@Entity()
export class TrackingOrder {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @CreateDateColumn()
    time: Date;

    @Column({
        type: 'enum',
        enum: TitleStatusEnum,
        default: TitleStatusEnum.ORDER_IS_REPARING,
    })
    title: TitleStatusEnum

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

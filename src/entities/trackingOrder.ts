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
 *      description: id of tracking
 *      example: '1'
 *     time:
 *      type: date
 *      description: date of tracking
 *      example: '2022-12-27T07:41:51.093Z'
 *     title:
 *      type: integer
 *      description: title of tracking
 *      example: '5.1'
 *     deliveryStatus:
 *      type: integer
 *      description: deliveryStatus of tracking
 *      example: '5'
 *     location:
 *      type: string
 *      description: location of tracking
 *      example: 'ho chi minh city'
 *   TrackingListResponse:
 *    type: array
 *    items:
 *     $ref: '#/components/schemas/TrackingResponse'
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

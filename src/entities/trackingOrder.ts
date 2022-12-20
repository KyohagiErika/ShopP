import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { DeliveryStatusEnum, TitleStatusEnum } from '../utils/shopp.enum';
import { Order } from './order';

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
        default: DeliveryStatusEnum.CHECKING,
    })
    deliveryStatus: DeliveryStatusEnum;

    @Column()
    location: string;

    @ManyToOne(() => Order, orderNumber => orderNumber.trackingOrders)
    orderNumber: Order;

}

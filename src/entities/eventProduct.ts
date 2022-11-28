import { Event } from './event';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from './product';
import { StatusEnum } from '../utils/shopp.enum';

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
    default: 0
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
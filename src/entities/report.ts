import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StatusReportEnum, TypeTransferEnum } from '../utils/shopp.enum';
import { Customer } from './customer';
import { Shop } from './shop';

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: TypeTransferEnum,
    default: TypeTransferEnum.CUSTOMER_TO_SHOP,
  })
  type: TypeTransferEnum;

  @Column()
  reason: string;

  @Column()
  description: string;

  @Column()
  @CreateDateColumn()
  reportAt: Date;

  @Column({
    type: 'enum',
    enum: StatusReportEnum,
    default: StatusReportEnum.PROCESSING,
  })
  status: StatusReportEnum;

  @ManyToOne(() => Shop, shop => shop.id)
  @JoinColumn()
  shop: Shop;

  @ManyToOne(() => Customer, customer => customer.id)
  @JoinColumn()
  customer: Customer;
}

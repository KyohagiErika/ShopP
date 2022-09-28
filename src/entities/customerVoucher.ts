import { Voucher } from './voucher';
import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';

import { Customer } from './customer';

@Entity()
export class Customer_Voucher {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Customer, customer => customer.customerVoucher)
  @JoinColumn()
  customer: Customer

  @ManyToOne(() => Voucher, voucher => voucher.customerVoucher)
  @JoinColumn()
  voucher: Voucher
}

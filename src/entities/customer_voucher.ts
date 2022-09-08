import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Customer } from './customer';

@Entity()
export class Customer_Voucher {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  voucher: string;
}

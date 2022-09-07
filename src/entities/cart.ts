import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Length, IsNotEmpty } from 'class-validator';
import { Customer } from './customer';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'json',
  })
  products: object;

  @OneToOne(() => Customer, customer => customer.cart)
  customer: Customer;
}

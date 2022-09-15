import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';

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
  @JoinColumn()
  customer: Customer;
}

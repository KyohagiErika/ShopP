import {
  Entity,
  Column,
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
    nullable: true,
  })
  products: string;

  @OneToOne(() => Customer, customer => customer.cart)
  @JoinColumn()
  customer: Customer;
}

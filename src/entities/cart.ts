import { Product } from './product';
import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';

import { Customer } from './customer';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;


  @OneToOne(() => Customer, customer => customer.cart)
  @JoinColumn()
  customer: Customer;

}



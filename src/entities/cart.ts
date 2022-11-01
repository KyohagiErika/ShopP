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

<<<<<<< HEAD
  @Column({ default: '' })
=======
  @Column({ nullable: true })
>>>>>>> 1048aaef8cca4e0c01f6d5da7e977bb3d21cb2eb
  products: string;

  @OneToOne(() => Customer, customer => customer.cart)
  @JoinColumn()
  customer: Customer;
}

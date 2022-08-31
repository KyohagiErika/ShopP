import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { Length, IsNotEmpty } from "class-validator";
import { Customer } from "./customer";

@Entity({ name: "Cart" })
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: "products",
    type: 'json'})
  @IsNotEmpty()
  products: object;

  @OneToOne(() => Customer, (customer) => customer.cart)
  @IsNotEmpty()
  customer: Customer;
}

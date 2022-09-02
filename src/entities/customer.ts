import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  CreateDateColumn,
  OneToOne,
} from "typeorm";

import { Length, IsNotEmpty } from "class-validator";
import { User } from "./user";
import { GenderEnum } from "../utils/shopp.enum";
import { Cart } from "./cart";

@Entity({ name: "customer" })
export class Customer {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  @Length(1, 100)
  @IsNotEmpty()
  name: string;

  @Column()
  avatar:number;

  @Column({
    name: "gender",
    type: "enum",
    enum: GenderEnum,
    default: GenderEnum.MALE,
  })
  gender: GenderEnum;

  @Column()
  @CreateDateColumn()
  dob: Date;

  @OneToOne(() => User, (user) => user.customer)
  @JoinColumn({ name: "user" })
  user: User;

  @Column()
  @IsNotEmpty()
  placeOfDelivery: string;

  @Column("json")
  followingShops: string[];

  @OneToOne(() => Cart, (cart) => cart.customer)
  cart: Cart;
}

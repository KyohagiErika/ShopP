import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
} from "typeorm";

import { Length, IsNotEmpty } from "class-validator";
import { User } from "./user";
import { GenderEnum } from "../utils/shopp.enum";
import { Cart } from "./cart";

@Entity({ name: "customer" })
export class Customer {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ name: "name" })
  @Length(1, 100)
  @IsNotEmpty()
  name: string;

  @Column({ name: "avatar" })
  avatar: number ;

  @Column({
    name:"gender",
    type: "enum",
    enum: GenderEnum,
    default: GenderEnum.MALE,
  })
  gender: GenderEnum;

  @Column({ name: "dob" })
  @CreateDateColumn()
  dob: Date;

  @OneToOne(() => User, (user) => user.customer)
  user: User;

  @Column({ name: "place_of_delivery" })
  @IsNotEmpty()
  placeOfDelivery: string;

  @Column("json", { name: "following_shops" })
  followingShops: string[];

  @OneToOne(() => Cart, (cart) => cart.customer)
  cart: Cart;
}

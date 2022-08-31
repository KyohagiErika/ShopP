import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  OneToOne,
} from "typeorm";

import { Length, IsNotEmpty } from "class-validator";
import bcrypt from "bcryptjs";
import { User } from "./user";
import { GenderEnum } from "../utils/shopp.enum";
import { Cart } from "./cart";

@Entity({ name: "Customer" })
export class Customer {
  @PrimaryColumn()
  id: string;

  @Column({ name: "name" })
  @Length(1, 100)
  @IsNotEmpty()
  name: string;

  @Column({ name: "avatar" })
  avatar: number | null|undefined;

  @Column({
    type: "enum",
    enum: GenderEnum,
    default: GenderEnum.MALE,
  })
  gender: GenderEnum;

  @Column({ name: "dob" })
  @CreateDateColumn()
  dob: Date|null|undefined;

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

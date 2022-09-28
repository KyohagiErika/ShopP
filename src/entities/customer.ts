import { Customer_Voucher } from './customerVoucher';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  CreateDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';

import { User } from './user';
import { GenderEnum } from '../utils/shopp.enum';
import { Cart } from './cart';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  avatar: number;

  @Column({
    type: 'enum',
    enum: GenderEnum,
    default: GenderEnum.MALE,
  })
  gender: GenderEnum;

  @Column({ nullable: true })
  dob: Date;

  @OneToOne(() => User, user => user.customer)
  @JoinColumn()
  user: User;

  @Column()
  placeOfDelivery: string;

  @Column('json', { nullable: true })
  followingShops: string;

  @OneToOne(() => Cart, cart => cart.customer)
  cart: Cart;

  @OneToMany(() => Customer_Voucher, customerVoucher => customerVoucher.customer)
  customerVoucher: Customer_Voucher
}

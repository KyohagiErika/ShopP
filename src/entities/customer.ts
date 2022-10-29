import { Shop } from './shop';
import { Voucher } from './voucher';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import { User } from './user';
import { GenderEnum } from '../utils/shopp.enum';
import { Cart } from './cart';
import { LocalFile } from './localFile';
import { Report } from './report';
import { OrderProduct } from './orderProduct';
import { Order } from './order';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToOne(() => LocalFile)
  @JoinColumn()
  avatar: LocalFile;

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

  @OneToOne(() => Cart, cart => cart.customer)
  cart: Cart;

  @ManyToMany(() => Voucher, voucher => voucher.customer)
  voucher: Voucher[];

  @OneToMany(() => Report, report => report.id)
  report: Report[];

  @OneToMany(() => Order, order => order.id)
  order: Order[];

  @ManyToMany(() => Shop, shop => shop.followers)
  @JoinTable()
  shopsFollowed: Shop[];
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToOne,
} from 'typeorm';

import { User } from './user';
import { GenderEnum } from '../utils/shopp.enum';
import { Cart } from './cart';
import { LocalFile } from './localFile';

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

  @Column('json', { nullable: true })
  followingShops: string;

  @OneToOne(() => Cart, cart => cart.customer)
  cart: Cart;
}

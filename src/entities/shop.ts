import { Customer } from './customer';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { LocalFile } from './localFile';
import { OrderProduct } from './orderProduct';
import { Order } from './order';
import { Product } from './product';
import { Report } from './report';
import { User } from './user';

@Entity()
export class Shop {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToOne(() => LocalFile)
  @JoinColumn()
  avatar: LocalFile;

  @OneToOne(() => User, user => user.shop)
  @JoinColumn()
  user: User;

  @OneToMany(() => Product, product => product.id)
  products: Product[];

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  placeOfReceipt: string;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  star: number;

  @Column({ default: 0 })
  followersNumber: number;

  @OneToMany(() => Report, report => report.id)
  report: Report[];

  @OneToMany(() => Order, order => order.id)
  order: Order[];
  @ManyToMany(() => Customer, customer => customer.shopsFollowed)
  followers: Customer[];
}

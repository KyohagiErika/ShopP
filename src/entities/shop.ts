import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Product } from './product';
import { User } from './user';

@Entity()
export class Shop {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  avatar: number;

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
  followers: number;
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { LocalFile } from './localFile';
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
  followers: number;

  @OneToMany(() => Report, report => report.id)
  report: Report[];
}

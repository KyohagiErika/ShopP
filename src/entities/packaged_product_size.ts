import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { Product } from './product';

@Entity()
export class PackagedProductSize {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  weight: number;

  @Column()
  lenght: number;

  @Column()
  width: number;

  @Column()
  height: number;

  @OneToOne(() => Product, product => product.id)
  @JoinColumn()
  product: Product;
}

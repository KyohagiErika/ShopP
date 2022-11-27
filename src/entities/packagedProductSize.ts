import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
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
  length: number;

  @Column()
  width: number;

  @Column()
  height: number;

  @OneToOne(() => Product, product => product.packagedProductSize)
  @JoinColumn()
  product: Product;
}

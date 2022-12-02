import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

import { Product } from './product';

@Entity()
export class ProductAdditionalInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  key: string;

  @Column()
  value: string;

  @ManyToOne(() => Product, product => product.productAdditionalInfo)
  product: Product;
}

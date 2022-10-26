import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { LocalFile } from './localFile';

import { Product } from './product';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Product, product => product.id)
  products: Product[];

  @OneToOne(() => LocalFile)
  @JoinColumn()
  image: LocalFile;
}

import { Cart } from './cart';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  OneToOne,
  ManyToMany,
} from 'typeorm';

import { ProductEnum } from '../utils/shopp.enum';
import { Category } from './category';
import { PackagedProductSize } from './packagedProductSize';
import { ProductAdditionalInfo } from './productAdditionalInfo';
import { ProductImage } from './productImage';
import { Shop } from './shop';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  detail: string;

  @Column()
  amount: number;

  @Column({ default: 0 })
  sold: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  star: number;

  @Column({
    type: 'enum',
    enum: ProductEnum,
    default: ProductEnum.AVAILABLE,
  })
  status: ProductEnum;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  deletedAt: Date;

  @ManyToOne(() => Shop, shop => shop.id)
  @JoinColumn()
  shop: Shop;

  @ManyToOne(() => Category, category => category.id)
  @JoinColumn()
  category: Category;

  @OneToMany(
    () => ProductAdditionalInfo,
    productAdditionalInfo => productAdditionalInfo.id
  )
  @JoinColumn()
  productAdditionalInfo: ProductAdditionalInfo[];

  @OneToOne(
    () => PackagedProductSize,
    packagedProductSize => packagedProductSize.id
  )
  packagedProductSize: PackagedProductSize;

  @OneToMany(() => ProductImage, productImage => productImage.product)
  @JoinColumn()
  productImage: ProductImage[];
  
}

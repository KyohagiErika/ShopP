import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';

import { ProductEnum } from '../utils/shopp.enum';
import { Category } from './category';
import { PackagedProductSize } from './packaged_product_size';
import { ProductAdditionalInfo } from './product_additional_info';
import { ProductImage } from './product_image';
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
  productAdditionalInfo: ProductAdditionalInfo;

  @OneToOne(
    () => PackagedProductSize,
    packagedProductSize => packagedProductSize.id
  )
  packagedProductSize: PackagedProductSize;

  @OneToMany(() => ProductImage, productImage => productImage.id)
  @JoinColumn()
  productImage: ProductImage;
}

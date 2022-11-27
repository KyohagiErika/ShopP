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
  JoinTable,
} from 'typeorm';
import { ProductEnum } from '../utils/shopp.enum';
import { Category } from './category';
import { OrderProduct } from './orderProduct';
import { PackagedProductSize } from './packagedProductSize';
import { ProductAdditionalInfo } from './productAdditionalInfo';
import { ProductImage } from './productImage';
import { Event } from './event';
import { Shop } from './shop';

/**
 * @swagger
 * components:
 *  schemas:
 *   ProductResponse:
 *    type: object
 *    properties:
 *     id:
 *      type: integer
 *      format: uuid
 *      description: id of product
 *      example: '7039afb2-b5c4-4fe3-a48e-dcdcb7fc5ed5'
 *     name:
 *      type: string
 *      description: name of product
 *      example: 'Ao len'
 *     detail:
 *      type: string
 *      description: detail of product
 *      example: 'Dep, ngon, bo, re'
 *     amount:
 *      type: integer
 *      format: int32
 *      description: amount of product
 *      example: '10000'
 *     quantity:
 *      type: integer
 *      format: int32
 *      description: quantity of product
 *      example: '123'
 *     sold:
 *      type: integer
 *      format: int32
 *      description: number of sold products
 *      example: '10'
 *     star:
 *      type: number
 *      format: double
 *      description: average star
 *      example: '4.5'
 *     status:
 *      type: string
 *      description: status of product
 *      example: 'AVAILABLE'
 *     shop:
 *      $ref: '#/components/schemas/ShopResponse'
 *     category:
 *      $ref: '#/components/schemas/CategoryResponse'
 *     productImage:
 *      $ref: '#/components/schemas/LocalFileListResponse'
 *   ProductListResponse:
 *    type: array
 *    items:
 *     $ref: '#/components/schemas/ProductResponse'
 */
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

  @Column()
  quantity: number;

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

  @Column({
    type: 'double',
    default: 0,
  })
  discount: number;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  deletedAt: Date;

  @ManyToOne(() => Shop, shop => shop.products)
  @JoinColumn()
  shop: Shop;

  @ManyToOne(() => Category, category => category.id)
  @JoinColumn()
  category: Category;

  @OneToMany(
    () => ProductAdditionalInfo,
    productAdditionalInfo => productAdditionalInfo.product
  )
  productAdditionalInfo: ProductAdditionalInfo[];

  @OneToOne(
    () => PackagedProductSize,
    packagedProductSize => packagedProductSize.product
  )
  packagedProductSize: PackagedProductSize;

  @OneToMany(() => ProductImage, productImage => productImage.product)
  @JoinColumn()
  productImage: ProductImage[];

  @OneToMany(() => OrderProduct, orderProduct => orderProduct.product)
  orderProduct: OrderProduct[];

  @ManyToMany(() => Event, event => event.products)
  @JoinTable()
  events: Event[];
}

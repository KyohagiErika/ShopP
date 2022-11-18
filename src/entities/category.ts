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

/**
 * @swagger
 * components:
 *  schemas:
 *   CategoryResponse:
 *    type: object
 *    properties:
 *     id:
 *      type: integer
 *      description: id of the category
 *      example: '1'
 *     name:
 *      type: string
 *      description: name of the category
 *      example: 'Ao Quan'
 *     image:
 *      $ref: '#/components/schemas/LocalFileResponse'
 *   CategoryListResponse:
 *    type: array
 *    items:
 *     $ref: '#/components/schemas/CategoryResponse'
 */
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

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from './product';

/**
 * @swagger
 * components:
 *  schemas:
 *   PackagedResponse:
 *    type: object
 *    properties:
 *     id:
 *      type: integer
 *      format: int32
 *      description: id of the product packaged
 *      example: '1'
 *     weight:
 *      type: double
 *      description: weight of the product packaged
 *      example: '23'
 *     length:
 *      type: double
 *      description: length of the product packaged
 *      example: '35'
 *     width:
 *      type: double
 *      description: width of the product packaged
 *      example: '48'
 *     height:
 *      type: double
 *      description: height of the product packaged
 *      example: '60'
 *   PackagedListResponse:
 *    type: array
 *    items:
 *     $ref: '#/components/schemas/PackagedResponse'
 */
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

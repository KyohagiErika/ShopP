import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

import { Product } from './product';

/**
 * @swagger
 * components:
 *  schemas:
 *   ProductAdditionalInfoResponse:
 *    type: object
 *    properties:
 *     id:
 *      type: integer
 *      format: int32
 *      description: id of the product information
 *      example: '1'
 *     key:
 *      type: string
 *      description: name of the product information
 *      example: 'size'
 *     value:
 *      type: string
 *      description: name of the product information
 *      example: 'S, M, L'
 *   ProductAdditionalInfoListResponse:
 *    type: array
 *    items:
 *     $ref: '#/components/schemas/ProductAdditionalInfoResponse'
 */
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

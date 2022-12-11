import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order';

/**
 * @swagger
 * components:
 *  schemas:
 *   ShoppingUnitResponse:
 *    type: object
 *    properties:
 *     id:
 *      type: integer
 *      format: int32
 *      description: id of the shopping unit
 *      example: '1'
 *     name:
 *      type: string
 *      description: name of the shopping unit
 *      example: 'J&T Express'
 *   ShoppingUnitListResponse:
 *    type: array
 *    items:
 *     $ref: '#/components/schemas/ShoppingUnitResponse'
 */
@Entity()
export class ShoppingUnit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Order, order => order.id)
  order: Order[];
}

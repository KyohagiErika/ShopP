import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order';

/**
 * @swagger
 * components:
 *  schemas:
 *   PaymentResponse:
 *    type: object
 *    properties:
 *     id:
 *      type: integer
 *      format: int32
 *      description: id of the payment
 *      example: '1'
 *     name:
 *      type: string
 *      description: name of the payment
 *      example: 'momo'
 *   PaymentListResponse:
 *    type: array
 *    items:
 *     $ref: '#/components/schemas/PaymentResponse'
 */

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Order, order => order.id)
  order: Order[];
}

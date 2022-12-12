import {
  Entity,
  Column,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { Customer } from './customer';

/**
 * @swagger
 * components:
 *  schemas:
 *   CartResponse:
 *    type: object
 *    properties:
 *     id:
 *      type: integer
 *      description: id of cart
 *      example: 1
 *     products:
 *      type: string
 *      description: products of cart
 *      example: [{id: 1234, name: "ao quan", amount: 5, color: "red" }, {id: 1234, name: "ao quan", amount: 5, color: "blue" }]
 */
@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: true,
  })
  products: string;

  @OneToOne(() => Customer, customer => customer.cart)
  @JoinColumn()
  customer: Customer;
}

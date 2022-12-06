import { Customer } from './customer';
import { EvaluationImage } from './evaluationImage';
import { OrderProduct } from './orderProduct';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToOne,
  CreateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';

/**
 * @swagger
 * components:
 *  schemas:
 *   EvaluationResponse:
 *    type: object
 *    properties:
 *     id:
 *      type: number
 *      description: id of evaluation
 *      example: 1
 *     star:
 *      type: number
 *      description: star of evaluation
 *      example: 5
 *     feedback:
 *      type: string
 *      description: feedback of evaluation
 *      example: it is good
 *     likes:
 *      type: number
 *      description: number of likes of evaluation
 *      example: 10
 *     createdAt:
 *      type: string
 *      description: day created of evaluation
 *      format: date-time
 *      example: 2022-10-29
 *     evaluationImages:
 *      $ref: '#/components/schemas/LocalFileResponse'
 *   EvaluationListResponse:
 *    type: array
 *    items:
 *     $ref: '#/components/schemas/EvaluationResponse'
 */
@Entity()
export class Evaluation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  star: number;

  @Column()
  feedback: string;

  @Column({
    default: 0,
  })
  likes: number;
  
  @CreateDateColumn()
  createdAt: Date;

  @ManyToMany(() => Customer, customer => customer.likedEvaluations)
  @JoinTable()
  likedPeople: Customer[];

  @OneToOne(() => OrderProduct, orderProduct => orderProduct.evaluation)
  @JoinColumn()
  orderProduct: OrderProduct;

  @OneToMany(
    () => EvaluationImage,
    evaluationImage => evaluationImage.evaluation
  )
  @JoinColumn()
  evaluationImages: EvaluationImage[];
}

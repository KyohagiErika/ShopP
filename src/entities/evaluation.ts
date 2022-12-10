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

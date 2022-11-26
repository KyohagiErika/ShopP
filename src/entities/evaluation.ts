import { EvaluationImage } from './evaluationImage';
import { LocalFile } from './localFile';
import { OrderProduct } from './orderProduct';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToOne,
  CreateDateColumn,
  OneToMany,
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

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @OneToOne(() => OrderProduct, orderProduct => orderProduct.evaluation)
  @JoinColumn()
  orderProduct: OrderProduct;

  @OneToMany(
    () => EvaluationImage,
    evaluationImage => evaluationImage.evaluation
  )
  @JoinColumn()
  evaluationImage: EvaluationImage[]
}

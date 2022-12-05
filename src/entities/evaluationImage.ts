import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Evaluation } from './evaluation';
import { LocalFile } from './localFile';

@Entity()
export class EvaluationImage {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => LocalFile, localFile => localFile.evaluationImage)
  @JoinColumn()
  localFile: LocalFile;

  @ManyToOne(() => Evaluation, evaluation => evaluation.evaluationImages)
  evaluation: Evaluation;
}

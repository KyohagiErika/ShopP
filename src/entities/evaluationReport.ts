import {
  ReasonEvaluationReportEnum,
  StatusReportEnum,
} from './../utils/shopp.enum';
import { User } from './user';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { Evaluation } from './evaluation';
import { RoleEnum } from '../utils/shopp.enum';

/**
 * @swagger
 * components:
 *  schemas:
 *   EvaluationReportResponse:
 *    type: object
 *    properties:
 *     id:
 *      type: number
 *      description: id of evaluation report
 *      example: 1
 *     reason:
 *      #ref: '#/components/schemas/ReasonEvaluationReportEnum'
 *     description:
 *      type: string
 *      description: description of evaluation report
 *      example: He said some things not good about the product but it is not true
 *     roleReporter:
 *      #ref: '#/components/schemas/RoleEnum'
 *     reportedAt:
 *      type: string
 *      format: date-time
 *      description: day created of evaluation report
 *      example: 2021-01-30T08:30:00Z
 *     status:
 *      #ref: '#/components/schemas/StatusReportEnum'
 *   EvaluationReportListResponse:
 *    type: array
 *    items:
 *     $ref: '#/components/schemas/EvaluationReportResponse'
 */
@Entity()
export class EvaluationReport {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: ReasonEvaluationReportEnum,
  })
  reason: ReasonEvaluationReportEnum;

  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: RoleEnum,
  })
  roleReporter: RoleEnum;

  @CreateDateColumn()
  reportedAt: Date;

  @Column({
    type: 'enum',
    enum: StatusReportEnum,
    default: StatusReportEnum.PROCESSING,
  })
  status: StatusReportEnum;

  @ManyToOne(() => Evaluation, evaluation => evaluation.evaluationReports)
  @JoinColumn()
  evaluation: Evaluation;

  @ManyToOne(() => User, user => user.evaluationReports)
  @JoinColumn()
  reporter: User;
}

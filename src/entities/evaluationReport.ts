import {
  ReasonEvaluationReport,
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
 *      type: string
 *      description: reason of evaluation report
 *      example: It is not true
 *     description:
 *      type: string
 *      description: description of evaluation report
 *      example: He said some things not good about the product but it is not true
 *     roleReporter:
 *      type: string
 *      description: role of reporter
 *      example: CUSTOMER
 *     reportedAt:
 *      type: string
 *      description: day created of evaluation report
 *      format: date-time
 *      example: 2022-10-29
 *     status:
 *      type: string
 *      description: status of evaluation report
 *      example: PROCESSING
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
    enum: ReasonEvaluationReport,
  })
  reason: ReasonEvaluationReport;

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

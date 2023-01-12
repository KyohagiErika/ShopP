import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StatusReportEnum, TypeTransferEnum } from '../utils/shopp.enum';
import { Customer } from './customer';
import { Shop } from './shop';

/**
 * @swagger
 * components:
 *  schemas:
 *   ReportResponse:
 *    type: object
 *    properties:
 *     id:
 *      type: integer
 *      format: int32
 *      description: id of the report
 *      example: '1'
 *     type:
 *      $ref: '#/components/schemas/TypeTransferEnum'
 *     resason:
 *      type: string
 *      description: reason of the report
 *      example: 'scam'
 *     description:
 *      type: string
 *      description: description of the report
 *      example: 'bad shop'
 *     reportAt:
 *      type: string
 *      format: date-time
 *      description: date time when creating report
 *      example: '2020-12-12T12:12:12.000Z'
 *     status:
 *      $ref: '#/components/schemas/StatusReportEnum'
 *     shop:
 *      type: string
 *      description: shopId of the report
 *      example: 'id'
 *     customer:
 *      type: string
 *      description: customerId of the report
 *      example: 'id'
 *   ReportListResponse:
 *    type: array
 *    items:
 *     $ref: '#/components/schemas/ReportResponse'
 */
@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: TypeTransferEnum,
    default: TypeTransferEnum.CUSTOMER_TO_SHOP,
  })
  type: TypeTransferEnum;

  @Column()
  reason: string;

  @Column()
  description: string;

  @Column()
  @CreateDateColumn()
  reportAt: Date;

  @Column({
    type: 'enum',
    enum: StatusReportEnum,
    default: StatusReportEnum.PROCESSING,
  })
  status: StatusReportEnum;

  @ManyToOne(() => Shop, shop => shop.id)
  @JoinColumn()
  shop: Shop;

  @ManyToOne(() => Customer, customer => customer.id)
  @JoinColumn()
  customer: Customer;
}

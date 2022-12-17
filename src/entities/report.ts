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
 *      type: enum
 *      description: type of the report
 *      example: 'CUSTOMER_TO_SHOP'
 *     resason:
 *      type: string
 *      description: reason of the report
 *      example: 'scam'
 *     description:
 *      type: string
 *      description: description of the report
 *      example: 'bad shop'
 *     reportAt:
 *      type: date
 *      description: date create report
 *      example: '15-12-2022'
 *     status:
 *      type: enum
 *      description: status of the report
 *      example: 'PROCESSING'
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

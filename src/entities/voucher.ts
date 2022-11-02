import { RoleEnum } from './../utils/shopp.enum';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  CreateDateColumn,
  OneToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from 'typeorm';

import { User } from './user';
import { VoucherTypeEnum } from '../utils/shopp.enum';
import { Customer } from './customer';
import { Order } from './order';
import { VoucherCustomerResponse } from '../interfaces/voucher';

@Entity()
export class Voucher {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({
    type: 'enum',
    enum: VoucherTypeEnum,
  })
  type: VoucherTypeEnum;

  @Column({
    type: 'enum',
    enum: RoleEnum,
  })
  roleCreator: RoleEnum;

  @ManyToOne(() => User, user => user.voucher)
  createdBy: User;

  @Column()
  amount: number;

  @Column('json', { nullable: true })
  condition: string;

  @Column()
  mfgDate: Date;

  @Column()
  expDate: Date;

  @ManyToMany(() => Customer, customer => customer.voucher)
  @JoinTable()
  customer: Customer[];

  @ManyToMany(() => Order, order => order.id)
  order: Order[];
  static mapVoucher(voucherEntity: Voucher): VoucherCustomerResponse {
    return {
      id: voucherEntity.id,
      title: voucherEntity.title,
      type: voucherEntity.type,
      condition: voucherEntity.condition,
      mfgDate: voucherEntity.mfgDate,
      expDate: voucherEntity.expDate,
    };
  }
}

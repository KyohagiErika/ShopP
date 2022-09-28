import { Customer_Voucher } from './customerVoucher';
import { RoleEnum } from './../utils/shopp.enum';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  CreateDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';

import { User } from './user';
import { VoucherTypeEnum } from '../utils/shopp.enum';
import { Cart } from './cart';

@Entity()
export class Voucher {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
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
  createdBy: RoleEnum;

  @Column({ nullable: true })
  amount: number;

  @Column('json', { nullable: true })
  condition: object;

  @Column()
  mfgDate: Date;

  @Column()
  expDate: Date;

  @OneToMany(() => Customer_Voucher, customerVoucher => customerVoucher.voucher)
  customerVoucher: Customer_Voucher;
}

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
}

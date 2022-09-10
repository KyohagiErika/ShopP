import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';

import bcrypt from 'bcryptjs';
import { UserRole } from './userRole';
import { Customer } from './customer';
import { StatusEnum } from '../utils/shopp.enum';
import { Shop } from './shop';
import { Event } from './event'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: StatusEnum,
    default: StatusEnum.ACTIVE,
  })
  status: StatusEnum;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  lockedAt: Date;

  @OneToMany(() => UserRole, userRole => userRole.user)
  roles: UserRole[];

  @OneToOne(() => Shop, shop => shop.user)
  shop: Shop;

  @OneToOne(() => Customer, customer => customer.user)
  customer: Customer;

  @OneToOne(() => Event, event => event.createdBy)
  event: Event;

  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 8);
  }

  checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
    return bcrypt.compareSync(unencryptedPassword, this.password);
  }
}

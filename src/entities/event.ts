import { EventProduct } from './eventProduct';
import { Product } from './product';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  CreateDateColumn,
  OneToOne,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import { User } from './user';
import { RoleEnum, StatusEnum } from '../utils/shopp.enum';
import { EventAdditionalInfo } from './eventAdditionalInfo';
import { LocalFile } from './localFile';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  content: string;

  @OneToOne(() => LocalFile, localFile => localFile.event)
  @JoinColumn()
  banner: LocalFile;

  @Column()
  startingDate: Date;

  @Column()
  endingDate: Date;

  @Column({
    type: 'enum',
    enum: RoleEnum,
    default: RoleEnum.ADMIN,
  })
  roleCreator: RoleEnum;

  @ManyToOne(() => User, user => user.event)
  @JoinColumn()
  createdBy: User;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column({
    type: 'enum',
    enum: StatusEnum,
    default: StatusEnum.ACTIVE,
  })
  status: StatusEnum;

  @OneToMany(
    () => EventAdditionalInfo,
    eventAdditionalInfo => eventAdditionalInfo.event
  )
  additionalInfo: EventAdditionalInfo[];

  // @ManyToMany(() => Product, product => product.events)
  // products: Product[];

  @OneToMany(() => EventProduct, eventProduct => eventProduct.event)
  eventProducts: EventProduct[]
}

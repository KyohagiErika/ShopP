import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  CreateDateColumn,
  OneToOne,
  ManyToOne,
} from 'typeorm';

import { User } from './user';
import { StatusEnum } from '../utils/shopp.enum';
import { Event_Additional_Info } from './eventAdditionalInfo';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  content: string;

  @Column()
  banner: number;

  @Column()
  startingDate: Date;

  @Column()
  endingDate: Date

  @Column({
    type: 'enum',
    enum: StatusEnum,
  })
  roleCreater: StatusEnum

  @OneToOne(() => User, createdBy => createdBy.event)
  @JoinColumn()
  createdBy: User

  @Column()
  createdAt: Date

  @Column({
    type: 'enum',
    enum: StatusEnum,
  })
  status: StatusEnum

  @ManyToOne(() => Event_Additional_Info, createdBy => createdBy.event)
  additionalInfo: Event_Additional_Info
}

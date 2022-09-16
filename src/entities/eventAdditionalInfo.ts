import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  CreateDateColumn,
  OneToOne,
  OneToMany,
  ManyToOne,
} from 'typeorm';

import { GenderEnum, StatusEnum } from '../utils/shopp.enum';
import { Event } from './event';

@Entity()
export class EventAdditionalInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  key: string;

  @Column()
  value: string;

  @ManyToOne(() => Event, event => event.additionalInfo)
  event: Event;
}

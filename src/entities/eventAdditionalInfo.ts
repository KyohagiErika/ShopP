import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  CreateDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';

import { GenderEnum,StatusEnum } from '../utils/shopp.enum';
import {Event} from './event'

@Entity()
export class Event_Additional_Info {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  key: string;

  @Column()
  value: string;

  @OneToMany(() => Event, event => event.additionalInfo)
  event: Event[]

}

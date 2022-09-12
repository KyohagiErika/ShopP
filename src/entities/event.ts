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
  endingDate: Date

  @Column({
    type: 'enum',
    enum: RoleEnum,
    default: RoleEnum.ADMIN
  })
  roleCreater: RoleEnum

  @OneToOne(() => User, user => user.event)
  @JoinColumn()
  createdBy: User

  @Column()
  createdAt: Date

  @Column({
    type: 'enum',
    enum: StatusEnum,
    default: StatusEnum.ACTIVE
  })
  status: StatusEnum

  @ManyToOne(() => EventAdditionalInfo, createdBy => createdBy.event)
  additionalInfo: EventAdditionalInfo

  
}

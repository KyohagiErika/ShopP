import { EventProduct } from './eventProduct';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  CreateDateColumn,
  OneToOne,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { User } from './user';
import { RoleEnum, StatusEnum } from '../utils/shopp.enum';
import { EventAdditionalInfo } from './eventAdditionalInfo';
import { LocalFile } from './localFile';

/**
 * @swagger
 * components:
 *  schemas:
 *   EventResponse:
 *    type: object
 *    properties:
 *     id:
 *      type: number
 *      description: id of event
 *      example: 3
 *     name:
 *      type: string
 *      description: name of event
 *      example: flashSales
 *     content:
 *      type: string
 *      description: content of event
 *      example: discount everything
 *     banner:
 *      $ref: '#/components/schemas/LocalFileResponse'
 *     startingDate:
 *      type: string
 *      description: starting day of event
 *      format: date
 *      example: 2022-10-29
 *     endingDate:
 *      type: string
 *      description: ending day of event
 *      format: date
 *      example: 2022-11-29
 *     additionalInfo:
 *      $ref: '#/components/schemas/EventAdditionalInfoListResponse'
 *   EventListResponse:
 *    type: array
 *    items:
 *     $ref: '#/components/schemas/EventResponse'
 */
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

  @OneToMany(() => EventProduct, eventProduct => eventProduct.event)
  eventProducts: EventProduct[];
}

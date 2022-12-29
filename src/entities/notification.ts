import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { RoleEnum } from '../utils/shopp.enum';
import { LocalFile } from './localFile';
import { User } from './user';

/**
 * @swagger
 * components:
 *  schemas:
 *   NotificationResponse:
 *    type: object
 *    properties:
 *     id:
 *      type: number
 *      description: id of notification
 *      example: 1
 *     title:
 *      type: string
 *      description: title of notification
 *      example: New event is coming soon!
 *     content:
 *      type: string
 *      description: content of notification
 *      example: New event is coming soon!...
 *     createdAt:
 *      type: string
 *      format: date-time
 *      description: day created of notification
 *      example: '2020-12-12T12:12:12.000Z'
 *     image:
 *      $ref: '#/components/schemas/LocalFileResponse'
 *   NotificationListResponse:
 *    type: array
 *    items:
 *     $ref: '#/components/schemas/NotificationResponse'
 */
@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @OneToOne(() => LocalFile)
  @JoinColumn()
  image: LocalFile;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToMany(() => User, receivers => receivers.notifications)
  @JoinTable()
  receivers: User[];

  @Column({
    type: 'enum',
    enum: RoleEnum,
    default: RoleEnum.CUSTOMER,
  })
  roleReceiver: RoleEnum;
}

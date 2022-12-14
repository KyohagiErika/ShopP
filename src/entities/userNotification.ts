import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { LocalFile } from './localFile';
import { User } from './user';
import { Notification } from './notification';

@Entity()
export class UserNotification {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, receiver => receiver.userNotifications)
  receiver: User;

  @Column()
  content: string;

  @OneToOne(() => LocalFile)
  @JoinColumn()
  image: LocalFile;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Notification, notification => notification.userNotifications)
  notification: Notification;
}

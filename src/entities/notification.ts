import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { LocalFile } from './localFile';
import { UserNotification } from './userNotification';

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

  @OneToMany(
    () => UserNotification,
    userNotifications => userNotifications.notification
  )
  userNotifications: UserNotification[];
}

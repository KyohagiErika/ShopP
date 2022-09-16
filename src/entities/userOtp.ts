import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user';
import { OtpEnum } from '../utils/shopp.enum';

@Entity()
export class UserOtp {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @Column({
    type: 'enum',
    enum: OtpEnum,
  })
  type: OtpEnum;

  @Column()
  otp: string;

  @Column()
  otpExpiration: Date;
}

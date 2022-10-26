import { Voucher } from './voucher';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';

import bcrypt from 'bcryptjs';
import { UserRole } from './userRole';
import { Customer } from './customer';
import { StatusEnum } from '../utils/shopp.enum';
import { Shop } from './shop';
import { Event } from './event';

/**
 * @swagger
 * definitions:
 *  LoginRequest:
 *   type: object
 *   properties:
 *    emailOrPhone:
 *     type: string
 *     description: email or phone of the user
 *     example: 'shopp123@gmail.com'
 *    password:
 *     type: string
 *     description: password of the user
 *     example: 'abcABC213&'
 *  CreateNewUserRequest:
 *   type: object
 *   properties:
 *    email:
 *     type: string
 *     description: email of the user
 *     example: 'shopp123@gmail.com'
 *    phone:
 *     type: string
 *     description: phone of the user
 *     example: '0987654321'
 *    password:
 *     type: string
 *     description: password of the user
 *     example: 'abcABC213&'
 *    confirmPassword:
 *     type: string
 *     description: confirm password of the user
 *     example: 'abcABC213&'
 *  EditUserRequest:
 *   type: object
 *   properties:
 *    email:
 *     type: string
 *     description: email of the user
 *     example: 'shopp123@gmail.com'
 *    phone:
 *     type: string
 *     description: phone of the user
 *     example: '0987654321'
 *  UserResponse:
 *   type: object
 *   properties:
 *    id:
 *     type: integer
 *     format: int32
 *     description: email of the user
 *     example: 'shopp123@gmail.com'
 *    email:
 *     type: string
 *     description: email of the user
 *     example: 'shopp123@gmail.com'
 *    phone:
 *     type: string
 *     description: phone of the user
 *     example: '0987654321'
 *  ForgotPasswordRequest:
 *   type: object
 *   properties:
 *    oldPassword:
 *     type: string
 *     description: password of the user
 *     example: 'abcABC213&'
 *    newPassword:
 *     type: string
 *     description: password of the user
 *     example: 'abcABfsdfC213&'
 *    confirmNewPassword:
 *     type: string
 *     description: confirm password of the user
 *     example: 'abcABfsdfC213&'
 *  ResetPasswordRequest:
 *   type: object
 *   properties:
 *    email:
 *     type: string
 *     description: email of the user
 *     example: 'shopp123@gmail.com'
 *    otp:
 *     type: string
 *     description: OTP from ShopP Email
 *     example: '123456'
 *    password:
 *     type: string
 *     description: new password of the user
 *     example: 'abcABfsdfC213&'
 *    confirmPassword:
 *     type: string
 *     description: confirm new password of the user
 *     example: 'abcABfsdfC213&'
 *  VerifyEmailRequest:
 *   type: object
 *   properties:
 *    email:
 *     type: string
 *     description: email of the user
 *     example: 'shopp123@gmail.com'
 *    otp:
 *     type: string
 *     description: OTP from ShopP Email
 *     example: '123456'
 */
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: StatusEnum,
    default: StatusEnum.ACTIVE,
  })
  status: StatusEnum;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  lockedAt: Date;

  @OneToOne(() => UserRole, userRole => userRole.user)
  role: UserRole;

  @OneToOne(() => Shop, shop => shop.user)
  shop: Shop;

  @OneToOne(() => Customer, customer => customer.user)
  customer: Customer;

  @OneToMany(() => Event, event => event.createdBy)
  event: Event[];

  @OneToMany(() => Voucher, voucher => voucher.createdBy)
  voucher: Voucher[];

  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 8);
  }

  checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
    return bcrypt.compareSync(unencryptedPassword, this.password);
  }
}

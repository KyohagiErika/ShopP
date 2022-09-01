import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  OneToOne,
} from "typeorm";

import { Length, IsNotEmpty } from "class-validator";
import bcrypt from "bcryptjs";
import { UserRole } from "./userRole";
import { Customer } from "./customer";
import { StatusEnum } from "../utils/shopp.enum";

@Entity({ name: "user" })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "email" })
  @Length(4, 60)
  @IsNotEmpty()
  email: string;

  @Column({ name: "phone" })
  @Length(10)
  @IsNotEmpty()
  phone: string;

  @Column({ name: "password" })
  @Length(10, 40)
  @IsNotEmpty()
  password: string;

  @Column({
    type: "enum",
    enum: StatusEnum,
    default: StatusEnum.ACTIVE,
  })
  status: StatusEnum;

  @Column({ name: "created_at" })
  @CreateDateColumn()
  createdAt: Date;

  @Column({ name: "locked_at" })
  lockedAt: Date;

  @OneToMany(() => UserRole, (userRole) => userRole.user)
  roles: UserRole[];

  @OneToOne(() => Customer, (customer) => customer.user)
  customer: Customer;

  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 8);
  }

  checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
    return bcrypt.compareSync(unencryptedPassword, this.password);
  }
}

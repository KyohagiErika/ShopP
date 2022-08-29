import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany
} from "typeorm";

import { Length, IsNotEmpty } from "class-validator";
import bcrypt from "bcryptjs";
import { UserRole } from "./userRole";
import Enum from "../utils/shopp.enum"

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Length(4, 20)
  @IsNotEmpty()
  email: string;

  @Column()
  @Length(10)
  @IsNotEmpty()
  phone: string;

  @Column()
  @Length(10, 40)
  @IsNotEmpty()
  password: string;

  @Column({
    type: "enum",
    enum: Enum.StatusEnum,
    default: Enum.StatusEnum.ACTIVE
  })
  status: Enum.StatusEnum

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  lockedAt: Date;

  @OneToMany(() => UserRole, (userRole) => userRole.user)
  roles: UserRole[]

  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 8);
  }

  checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
    return bcrypt.compareSync(unencryptedPassword, this.password);
  }
}

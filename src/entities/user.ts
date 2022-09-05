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
import { StatusEnum} from "../utils/shopp.enum"

@Entity({ name: "user" })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Length(4, 60)
  @IsNotEmpty()
  email: string;

  @Column()
  @Length(10)
  @IsNotEmpty()
  phone: string;

  @Column()
  @IsNotEmpty()
  password: string;

  @Column({
    type: "enum",
    enum: StatusEnum,
    default: StatusEnum.ACTIVE,
  })
  status: StatusEnum;

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

import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { Length, IsNotEmpty } from "class-validator";
import { Customer } from "./customer";

@Entity({name:'Customer_Voucher'})
export class Customer_Voucher {
  @PrimaryGeneratedColumn()
  id:number

  @Column({name:'voucher'})
  voucher:string
}
import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm"
import { IsNotEmpty } from "class-validator";
import { User } from "./user";
import Enum from "../utils/shopp.enum"

@Entity()
export class UserRole extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.roles)
    user: User

    @IsNotEmpty()
    @Column({
        type: "enum",
        enum: Enum.RoleEnum,
    })
    role: Enum.RoleEnum
}
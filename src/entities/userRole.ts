import {
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm"
import { IsNotEmpty } from "class-validator";
import { User } from "./user";
import { RoleEnum } from "../utils/shopp.enum"

@Entity()
export class UserRole {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.roles)
    //@JoinColumn({name: "user"})
    user: User

    @IsNotEmpty()
    @Column({
        type: "enum",
        enum: RoleEnum,
    })
    role: RoleEnum
}
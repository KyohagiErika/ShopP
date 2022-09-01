import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm"
import { IsNotEmpty } from "class-validator";
import { User } from "./user";
import { RoleEnum } from "../utils/shopp.enum"

@Entity()
export class LocalFile {
    @PrimaryGeneratedColumn()
    id: number;

    @IsNotEmpty()
    @Column()
    filename: string;

    @IsNotEmpty()
    @Column()
    path: string;

    @IsNotEmpty()
    @Column()
    mimetype: string;
}
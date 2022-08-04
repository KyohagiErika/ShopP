import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Account {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: String, unique: true })
    username: string;

    @Column({ type: String })
    password: string;

    @CreateDateColumn()
    createdAt: Date;
}
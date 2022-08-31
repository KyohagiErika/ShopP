import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
  } from "typeorm";
  
  import { Length, IsNotEmpty } from "class-validator";

  @Entity()
  export class LocalFile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Length(4, 60)
  @IsNotEmpty()
  fileName: string;

  @Column()
  @Length(1, 60)
  @IsNotEmpty()
  path: string;

  @Column()
  @Length(4, 60)
  mimetype: string;

}
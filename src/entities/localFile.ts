import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Event } from './event';
import { ProductImage } from './productImage';

@Entity()
export class LocalFile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filename: string;

  @Column()
  path: string;

  @Column()
  mimetype: string;

  @OneToOne(() => Event, event => event.banner)
  event: Event;

  @OneToOne(() => ProductImage, productImage => productImage.id)
  productImage: ProductImage;
}

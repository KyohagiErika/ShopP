import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Event } from './event';
import { ProductImage } from './productImage';

/**
 * @swagger
 * components:
 *  schemas:
 *   LocalFileResponse:
 *    type: object
 *    properties:
 *     id:
 *      type: integer
 *      format: int32
 *      description: id of the local file
 *      example: '99'
 *     filename:
 *      type: string
 *      description: filename
 *      example: 'image-1667040838083.png'
 *     path:
 *      type: string
 *      description: path
 *      example: 'public\uploads\image-1667040838083.png'
 *     mimetype:
 *      type: string
 *      description: mimetype
 *      example: 'image/png'
 *   LocalFileListResponse:
 *    type: array
 *    items:
 *     $ref: '#/components/schemas/LocalFileResponse'
 */
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

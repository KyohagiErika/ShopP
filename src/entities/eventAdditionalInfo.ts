import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Event } from './event';

/**
 * @swagger
 * components:
 *  schemas:
 *   EventAdditionalInfoResponse:
 *    type: object
 *    properties:
 *     key:
 *      type: string
 *      description: key of event additional info
 *      example: describe
 *     value:
 *      type: string
 *      description: value of event additional info
 *      example: tặng mẹ yêu siêu deal triệu quà
 *   EventAdditionalInfoListResponse:
 *    type: array
 *    items:
 *     $ref: '#/components/schemas/EventAdditionalInfoResponse'
 */
@Entity()
export class EventAdditionalInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  key: string;

  @Column()
  value: string;

  @ManyToOne(() => Event, event => event.additionalInfo)
  event: Event;
}

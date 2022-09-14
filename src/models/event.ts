import { UserRole } from './../entities/userRole';
import { User } from './../entities/user';
import { LocalFile } from './../entities/localFile';
import { EventAdditionalInfo } from './../entities/eventAdditionalInfo';
import { HttpStatusCode, RoleEnum } from './../utils/shopp.enum';
import { Event } from './../entities/event';
import { ShopPDataSource } from './../data';
import { StatusEnum } from '../utils/shopp.enum';
import Response from '../utils/response';

export default class EventModel {
  
  static async listAdminEvents() {
    const eventRepository = ShopPDataSource.getRepository(Event)

    const eventList = await eventRepository.find({
      where: {
        status: StatusEnum.ACTIVE
      },
      relations: ['additionalInfo']
    })

    if(eventList == null) {
      return new Response(HttpStatusCode.BAD_REQUEST, 'No events existed')
    }
    return new Response(HttpStatusCode.OK, 'Show Events successfully', eventList)
    
  }

  static async listShopEvents(userId: number) {
    const eventRepository = ShopPDataSource.getRepository(Event)

    const eventList = await eventRepository.find({
      where: {
        status: StatusEnum.ACTIVE,
        createdBy: {id: userId}
      },
      relations: ['additionalInfo']
    })

    if(eventList == null) {
      return new Response(HttpStatusCode.BAD_REQUEST, 'No events existed')
    }
    return new Response(HttpStatusCode.OK, 'Show Events successfully', eventList)
  }

  static async newEvent(userId: number ,name: string, content: string, bannerId:number, startingDate: Date, endingDate: Date, additionalInfo:EventAdditionalInfo[]) {
    const eventRepository = ShopPDataSource.getRepository(Event)
    const localFileRepository = ShopPDataSource.getRepository(LocalFile)
    const userRoleRepository = ShopPDataSource.getRepository(UserRole)

    const banner = await localFileRepository.findOne({
      where: {
        id: bannerId
      }
    })

    if(banner == null) 
      return new Response(HttpStatusCode.BAD_REQUEST, 'Unavailable banner!')
    
    const userRole = await userRoleRepository.findOne({
      where: {
        user: {id: userId},
        role: RoleEnum.ADMIN
      }
    })
    let roleCreator: RoleEnum = RoleEnum.ADMIN
    
    if(userRole == null)
      roleCreator = RoleEnum.SHOP

    const event = await eventRepository.save({
      name,
      content,
      banner,
      startingDate,
      endingDate,
      roleCreator,
      additionalInfo
    })

    return new Response(HttpStatusCode.CREATED, 'Create event successfully!', event)
  }

  static async editEvent(id: number, name: string, content: string, bannerId: number, startingDate: Date, endingDate: Date) {

  }

  static async deleteEvent(id: number) {
    const eventRepository = ShopPDataSource.getRepository(Event)

    const result = await eventRepository.update(
      {
        id,
        status: StatusEnum.ACTIVE
      },{
      status: StatusEnum.INACTIVE
    })

    if(result.affected == 1) {
      return new Response(HttpStatusCode.BAD_REQUEST, 'Delete event successfully!')
    }
    return new Response(HttpStatusCode.OK, 'Delete event failed!')
  }
}
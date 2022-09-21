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
  static async listAdminEvents(userId: number) {
    const eventRepository = ShopPDataSource.getRepository(Event);
    const adminEventList = await eventRepository.find({
      where: {
        status: StatusEnum.ACTIVE,
        roleCreator: RoleEnum.ADMIN,
      },
      relations: {
        additionalInfo: true,
        banner: true,
        createdBy: true,
      },
      select: {
        id: true,
        name: true,
        content: true,
        startingDate: true,
        endingDate: true,
        roleCreator: true,
        createdBy: { id: true, email: true, phone: true },
        additionalInfo: { key: true, value: true },
      },
    });
    if (adminEventList == null) {
      return new Response(HttpStatusCode.BAD_REQUEST, 'No events existed');
    }
    return new Response(
      HttpStatusCode.OK,
      'Show Events successfully',
      adminEventList
    );
  }

  static async listShopEvents(userId: number) {
    const eventRepository = ShopPDataSource.getRepository(Event);
    const eventList = await eventRepository.find({
      where: {
        status: StatusEnum.ACTIVE,
        createdBy: { id: userId },
      },
      relations: {
        additionalInfo: true,
        banner: true,
        createdBy: true,
      },
      select: {
        id: true,
        name: true,
        content: true,
        startingDate: true,
        endingDate: true,
        roleCreator: true,
        createdBy: { id: true, email: true, phone: true },
        additionalInfo: {key: true, value: true}
      },
    });
    if (eventList.length == 0) {
      return new Response(HttpStatusCode.BAD_REQUEST, 'No events existed');
    }
    return new Response(
      HttpStatusCode.OK,
      'Show Events successfully',
      eventList
    );
  }

  static async newEvent(
    userId: number,
    name: string,
    content: string,
    bannerId: number,
    startingDate: Date,
    endingDate: Date,
    additionalInfo: object
  ) {
    const eventRepository = ShopPDataSource.getRepository(Event);
    const localFileRepository = ShopPDataSource.getRepository(LocalFile);
    const userRoleRepository = ShopPDataSource.getRepository(UserRole);
    const userRepository = ShopPDataSource.getRepository(User);
    const additionalInfoRepository =
      ShopPDataSource.getRepository(EventAdditionalInfo);
    let banner = null;
    if (bannerId != null) {
      banner = await localFileRepository.findOne({
        where: {
          id: bannerId,
        },
      });
      if (banner == null)
        return new Response(HttpStatusCode.BAD_REQUEST, 'Unavailable banner!');
    }
    const user = await userRepository.findOne({
      relations: {
        role: true
      },
      where: {
        id: userId,
      },
    });
    if (user == null) {
      return new Response(HttpStatusCode.BAD_REQUEST, 'User doesnt exist!');
    }
    let roleCreator: RoleEnum ;
    if(user.role.role == RoleEnum.ADMIN)
      roleCreator = RoleEnum.ADMIN
    else if(user.role.role == RoleEnum.SHOP)
      roleCreator = RoleEnum.SHOP
    else return new Response(HttpStatusCode.BAD_REQUEST, 'Unauthorized role. Only shop or admin can create events!');
    let event: Event;
    if (banner != null) {
      event = await eventRepository.save({
        name,
        content,
        banner,
        startingDate,
        endingDate,
        roleCreator,
        createdBy: user,
      });
    } else {
      event = await eventRepository.save({
        name,
        content,
        startingDate,
        endingDate,
        roleCreator,
        createdBy: user,
      });
    }
    let arrayKeys = Object.keys(additionalInfo);
    let arrayValues = Object.values(additionalInfo);
    for (let i = 0; i < arrayKeys.length; i++) {
      const eventAdditionalInfo = await additionalInfoRepository.save({
        key: arrayKeys[i],
        value: arrayValues[i],
        event,
      });
    }
    console.log(event.additionalInfo)
    return new Response(
      HttpStatusCode.CREATED,
      'Create event successfully!',
      // event
      // select: {
      //         id: true,
      //         name: true,
      //         content: true,
      //         startingDate: true,
      //         endingDate: true,
      //         roleCreator: true,
      //         createdBy: { id: true, email: true, phone: true },
      //         additionalInfo: {key: true, value: true}
      //       },
      {
        id: event.id,
        name: event.name,
        content: event.content,
        startingDate: event.startingDate,
        endingDate: event.endingDate,
        roleCreator: event.roleCreator,
        createdBy: {
          id: event.createdBy
        },
      }
    );
  }

  static async editEvent(
    userId: number,
    id: number,
    name: string,
    content: string,
    bannerId: number,
    startingDate: Date,
    endingDate: Date,
    additionalInfo: object
  ) {
    const eventRepository = ShopPDataSource.getRepository(Event);
    const localFileRepository = ShopPDataSource.getRepository(LocalFile);
    const additionalInfoRepository =
      ShopPDataSource.getRepository(EventAdditionalInfo);
    const event = await eventRepository.findOne({
      relations: {
        additionalInfo: true,
        createdBy: true
      },
      where: {
        id,
        status: StatusEnum.ACTIVE
      },
    });
    // console.log(event)
    if (event == null)
      return new Response(HttpStatusCode.BAD_REQUEST, 'Unavailable event!');
    if(event.createdBy.id != userId)
      return new Response(HttpStatusCode.BAD_REQUEST, 'Unauthorized user!');
    let banner = null;
    if (bannerId != null && bannerId != undefined && bannerId.toString().length!=0) {
      banner = await localFileRepository.findOne({
        where: {
          id: bannerId,
        },
      });
      if (banner == null)
        return new Response(HttpStatusCode.BAD_REQUEST, 'Unavailable banner!');
    }
    const addtionalInfoList = await additionalInfoRepository.delete({
      event: { id },
    });
    let arrayKeys = Object.keys(additionalInfo);
    let arrayValues = Object.values(additionalInfo);
    for (let i = 0; i < arrayKeys.length; i++) {
      const eventAdditionalInfo = await additionalInfoRepository.save({
        key: arrayKeys[i],
        value: arrayValues[i],
        event,
      });
    }
    let result;
    if (banner == null) {
      result = await eventRepository.update(
        { id },
        {
          name,
          content,
          startingDate,
          endingDate,
        }
      );
    } else {
      result = await eventRepository.update(
        { id },
        {
          name,
          content,
          banner,
          startingDate,
          endingDate,
        }
      );
    }
    if (result.affected != 0)
      return new Response(HttpStatusCode.OK, 'Edit Event successfully!');
    return new Response(HttpStatusCode.BAD_REQUEST, 'Edit Event failed!');
  }

  static async deleteEvent(id: number) {
    const eventRepository = ShopPDataSource.getRepository(Event);
    const result = await eventRepository.update(
      {
        id,
        status: StatusEnum.ACTIVE,
      },
      {
        status: StatusEnum.INACTIVE,
      }
    );
    if (result.affected == 1) {
      return new Response(HttpStatusCode.OK, 'Delete event successfully!');
    }
    return new Response(HttpStatusCode.BAD_REQUEST, 'Delete event failed!');
  }
}

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
    const eventRepository = ShopPDataSource.getRepository(Event);
    const adminEventList = await eventRepository.find({
      relations: {
        additionalInfo: true,
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
      where: {
        roleCreator: 1,
        status: StatusEnum.ACTIVE,
      },
    });
    if(adminEventList[0].roleCreator != 1) console.log('ngu') 
    if (adminEventList.length ==  0) {
      return new Response(HttpStatusCode.BAD_REQUEST, 'No events existed');
    }
    return new Response(
      HttpStatusCode.OK,
      'Show Events successfully',
      adminEventList
    );
  }

  static async listShopEvents(user: User) {
    const eventRepository = ShopPDataSource.getRepository(Event);
    let eventList;
    if (user.role.role == RoleEnum.SHOP) {
      eventList = await eventRepository.find({
        where: {
          status: StatusEnum.ACTIVE,
          createdBy: { id: user.id },
          roleCreator: RoleEnum.SHOP,
        },
        relations: {
          additionalInfo: true,
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
    } else if (user.role.role == RoleEnum.ADMIN) {
      eventList = await eventRepository.find({
        where: {
          status: StatusEnum.ACTIVE,
          roleCreator: RoleEnum.SHOP,
        },
        relations: {
          additionalInfo: true,
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
    } else {
      return new Response(
        HttpStatusCode.BAD_REQUEST,
        'Unauthorized role. Only admin or shop!'
      );
    }
    if (eventList.length == 0)
      return new Response(HttpStatusCode.BAD_REQUEST, 'No events existed');
    return new Response(
      HttpStatusCode.OK,
      'Show Events successfully',
      eventList
    );
  }

  static async findEventById(id: number, user: User) {
    if (user.role.role == RoleEnum.CUSTOMER)
      return new Response(
        HttpStatusCode.BAD_REQUEST,
        'Unauthorized role. Only shop or admin!'
      );
    const eventRepository = ShopPDataSource.getRepository(Event);
    const event = await eventRepository.findOne({
      where: {
        status: StatusEnum.ACTIVE,
        id,
      },
      relations: {
        additionalInfo: true,
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
    if (event == null)
      return new Response(HttpStatusCode.BAD_REQUEST, 'Unavailable event!');
    if (user.role.role == RoleEnum.SHOP) {
      if (event.createdBy.id != user.id)
        return new Response(HttpStatusCode.BAD_REQUEST, 'Unavailable event!');
    }
    return new Response(HttpStatusCode.OK, 'Show Event successfully!', event);
  }

  static async newEvent(
    user: User,
    name: string,
    content: string,
    bannerId: number,
    startingDate: Date,
    endingDate: Date,
    additionalInfo: object
  ) {
    if (user.role.role == RoleEnum.CUSTOMER)
      return new Response(
        HttpStatusCode.BAD_REQUEST,
        'Unauthorized role. Only shop or admin!'
      );
    const eventRepository = ShopPDataSource.getRepository(Event);
    const localFileRepository = ShopPDataSource.getRepository(LocalFile);
    const additionalInfoRepository =
      ShopPDataSource.getRepository(EventAdditionalInfo);
    let banner = null;
    if (
      bannerId != null &&
      bannerId != undefined &&
      bannerId.toString().length != 0
    ) {
      banner = await localFileRepository.findOne({
        where: {
          id: bannerId,
        },
      });
      if (banner == null)
        return new Response(HttpStatusCode.BAD_REQUEST, 'Unavailable banner!');
    }

    let event: Event;
    if (banner != null) {
      event = await eventRepository.save({
        name,
        content,
        banner,
        startingDate,
        endingDate,
        roleCreator: user.role.role,
        createdBy: user,
      });
    } else {
      event = await eventRepository.save({
        name,
        content,
        startingDate,
        endingDate,
        roleCreator: user.role.role,
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
    return new Response(HttpStatusCode.CREATED, 'Create event successfully!', {
      id: event.id,
      name: event.name,
      content: event.content,
      startingDate: event.startingDate,
      endingDate: event.endingDate,
      roleCreator: event.roleCreator,
      createdBy: {
        id: event.createdBy.id,
        phone: event.createdBy.phone,
        email: event.createdBy.email,
      },
      additionalInfo: additionalInfo,
    });
  }

  static async editEvent(
    user: User,
    id: number,
    name: string,
    content: string,
    bannerId: number,
    startingDate: Date,
    endingDate: Date,
    additionalInfo: object
  ) {
    if (user.role.role == RoleEnum.CUSTOMER)
      return new Response(
        HttpStatusCode.BAD_REQUEST,
        'Unauthorized role. Only shop or admin!'
      );
    const eventRepository = ShopPDataSource.getRepository(Event);
    const localFileRepository = ShopPDataSource.getRepository(LocalFile);
    const additionalInfoRepository =
      ShopPDataSource.getRepository(EventAdditionalInfo);
    const event = await eventRepository.findOne({
      relations: {
        additionalInfo: true,
        createdBy: true,
      },
      where: {
        id,
        status: StatusEnum.ACTIVE,
      },
    });
    if (event == null)
      return new Response(HttpStatusCode.BAD_REQUEST, 'Unavailable event!');
    if (event.createdBy.id != user.role.role)
      return new Response(HttpStatusCode.BAD_REQUEST, 'Unauthorized user!');
    let banner = null;
    if (
      bannerId != null &&
      bannerId != undefined &&
      bannerId.toString().length != 0
    ) {
      banner = await localFileRepository.findOne({
        where: {
          id: bannerId,
        },
      });
      if (banner == null)
        return new Response(HttpStatusCode.BAD_REQUEST, 'Unavailable banner!');
    }
    await additionalInfoRepository.delete({
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

  static async deleteEvent(id: number, user: User) {
    if (user.role.role == RoleEnum.CUSTOMER)
      return new Response(
        HttpStatusCode.BAD_REQUEST,
        'Unauthorized role. Only shop or admin!'
      );
    const eventRepository = ShopPDataSource.getRepository(Event);
    const event = await eventRepository.findOne({
      relations: {
        createdBy: true,
      },
      where: {
        id,
      },
    });
    if (event == null)
      return new Response(HttpStatusCode.BAD_REQUEST, 'Unavailable event!');
    if (event.createdBy.id != user.id)
      return new Response(HttpStatusCode.BAD_REQUEST, 'Unauthorized user!');
    if (event.status == StatusEnum.INACTIVE)
      return new Response(
        HttpStatusCode.BAD_REQUEST,
        'event has been already deleted!'
      );
    const result = await eventRepository.update(
      {
        id,
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

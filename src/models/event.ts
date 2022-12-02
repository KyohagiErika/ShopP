import { EventProduct } from './../entities/eventProduct';
import { productsInCart } from './../interfaces/cart';
import { Product } from './../entities/product';
import { Shop } from './../entities/shop';
import { User } from './../entities/user';
import { LocalFile } from './../entities/localFile';
import { EventAdditionalInfo } from './../entities/eventAdditionalInfo';
import { HttpStatusCode, RoleEnum, StatusEnum } from './../utils/shopp.enum';
import { Event } from './../entities/event';
import { ShopPDataSource } from './../data';
import Response from '../utils/response';
import { ArrayContainedBy, ArrayContains, IsNull, Like, Not } from 'typeorm';

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
        status: StatusEnum.ACTIVE,
        roleCreator: Like(RoleEnum.ADMIN),
      },
    });
    if (adminEventList.length == 0) {
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
          roleCreator: Like(RoleEnum.SHOP),
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
          roleCreator: Like(RoleEnum.SHOP),
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
      if (event.roleCreator == RoleEnum.SHOP) {
        if (event.createdBy.id != user.id)
          return new Response(HttpStatusCode.BAD_REQUEST, 'Unavailable event!');
      }
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
    if (event.createdBy.id != user.id)
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

  static async joinEvent(
    eventId: number,
    productIdList: string[],
    discount: number,
    amount: number,
    user: User
  ) {
    if (
      user.role.role == RoleEnum.ADMIN ||
      user.role.role == RoleEnum.CUSTOMER
    ) {
      return new Response(
        HttpStatusCode.BAD_REQUEST,
        'Unauthorized role. Only shop can access!'
      );
    }
    const eventRepository = ShopPDataSource.getRepository(Event);
    const productRepository = ShopPDataSource.getRepository(Product);
    const eventProductRepository = ShopPDataSource.getRepository(EventProduct)
    let productListThatEligible: Product[] = [];
    // let productIdListThatNotExist: string[] = [];
    // let productIdListAlreadyExistInThisEvent: string[] = [];
    // let productIdListThatIsNotYours: string[] = [];
    const event = await eventRepository.findOne({
      relations: {
        createdBy: true
      },
      where: {
        id: eventId,
      },
    });
    if (!event) {
      return new Response(HttpStatusCode.BAD_REQUEST, 'Event not exist!');
    }
    if (
      event.status == StatusEnum.INACTIVE ||
      event.status == StatusEnum.LOCKED
    )
      return new Response(HttpStatusCode.BAD_REQUEST, 'Event is inactive!');
    if(event.roleCreator == RoleEnum.SHOP && event.createdBy.id != user.id)
      return new Response(HttpStatusCode.BAD_REQUEST, 'Unauthorized access to this event!');
    for (let i = 0; i < productIdList.length; i++) {
      const product = await productRepository.findOne({
        relations: {
          shop: true,
          eventProducts: true,
        },
        where: {
          id: productIdList[i],
        },
      });
      if (!product) {
        return new Response(
          HttpStatusCode.BAD_REQUEST,
          'Some products not exist'
        );
      }
      if (product.shop.id != user.shop.id) {
        return new Response(
          HttpStatusCode.BAD_REQUEST,
          'Some products are not yours'
        );
      }
      
      const eventProduct = await eventProductRepository.findOne({
        relations: {
          product: true,
          event: true
        },
        where: {
          status: StatusEnum.ACTIVE,
          product: {id: product.id},
          event: {id: eventId}
        }
      })
      if (eventProduct)
        return new Response(
          HttpStatusCode.BAD_REQUEST,
          'Some products that already exist in this event'
        );
      if (product.quantity < amount) {
        return new Response(
          HttpStatusCode.BAD_REQUEST,
          'Some products do not have enough quantity'
        );
      } 
      productListThatEligible.push(product);
    }
    for (let i = 0; i < productListThatEligible.length; i++) {
      await eventProductRepository.save({
        discount,
        amount,
        event,
        status: StatusEnum.ACTIVE,
        product: productListThatEligible[i],
      });
    }
    return new Response(HttpStatusCode.OK, 'Register event successfully!');
  }

  static async editProductDiscountFromEvent(
    eventId: number,
    productIdList: string[],
    discount: number,
    amount: number,
    user: User
  ) {
    if (
      user.role.role == RoleEnum.ADMIN ||
      user.role.role == RoleEnum.CUSTOMER
    ) {
      return new Response(
        HttpStatusCode.BAD_REQUEST,
        'Unauthorized role. Only shop can access!'
      );
    }
    const eventRepository = ShopPDataSource.getRepository(Event);
    const productRepository = ShopPDataSource.getRepository(Product);
    const eventProductRepository = ShopPDataSource.getRepository(EventProduct);
    let productListThatEligible: Product[] = [];
    const event = await eventRepository.findOne({
      relations: {
        createdBy: true,
      },
      where: {
        id: eventId,
      },
    });
    if (!event)
      return new Response(HttpStatusCode.BAD_REQUEST, 'Event not exist!');
    if (
      event.status == StatusEnum.INACTIVE ||
      event.status == StatusEnum.LOCKED
    )
      return new Response(HttpStatusCode.BAD_REQUEST, 'Event is inactive!');
    if (event.roleCreator == RoleEnum.SHOP && event.createdBy.id != user.id)
      return new Response(
        HttpStatusCode.BAD_REQUEST,
        'Unauthorized access to this event!'
      );
    for (let i = 0; i < productIdList.length; i++) {
      const product = await productRepository.findOne({
        relations: {
          shop: true,
          eventProducts: true,
        },
        where: {
          id: productIdList[i],
        },
      });
      if (!product) {
        return new Response(
          HttpStatusCode.BAD_REQUEST,
          'Some products not exist'
        );
      }
      if (product.shop.id != user.shop.id) {
        return new Response(
          HttpStatusCode.BAD_REQUEST,
          'Some products are not yours'
        );
      }
      const eventProduct = await eventProductRepository.findOne({
        relations: {
          product: true,
          event: true,
        },
        where: {
          status: StatusEnum.ACTIVE,
          product: { id: product.id },
          event: { id: eventId },
        },
      });
      if (!eventProduct)
        return new Response(
          HttpStatusCode.BAD_REQUEST,
          'Some products not exist in this event'
        );
      else {
        productListThatEligible.push(product);
      }
    }
    for (let i = 0; i < productListThatEligible.length; i++) {
      await eventProductRepository.save({
        discount,
        amount,
        event,
        product: productListThatEligible[i],
      });
    }
    return new Response(HttpStatusCode.OK, 'Edit successfully!');
  }

  static async deleteProductsOfEvent(
    eventId: number,
    productIdList: string[],
    user: User
  ) {
    if (
      user.role.role == RoleEnum.ADMIN ||
      user.role.role == RoleEnum.CUSTOMER
    ) {
      return new Response(
        HttpStatusCode.BAD_REQUEST,
        'Unauthorized role. Only shop can access!'
      );
    }
    const eventRepository = ShopPDataSource.getRepository(Event);
    const productRepository = ShopPDataSource.getRepository(Product);
    const eventProductRepository = ShopPDataSource.getRepository(EventProduct);
    let eventProductListThatEligible: EventProduct[] = [];
    const event = await eventRepository.findOne({
      relations: {
        createdBy: true,
      },
      where: {
        id: eventId,
      },
    });
    if (!event)
      return new Response(HttpStatusCode.BAD_REQUEST, 'Event not exist!');
    if (
      event.status == StatusEnum.INACTIVE ||
      event.status == StatusEnum.LOCKED
    )
      return new Response(HttpStatusCode.BAD_REQUEST, 'Event is inactive!');
    if (event.roleCreator == RoleEnum.SHOP && event.createdBy.id != user.id)
      return new Response(
        HttpStatusCode.BAD_REQUEST,
        'Unauthorized access to this event!'
      );
    for (let i = 0; i < productIdList.length; i++) {
      const product = await productRepository.findOne({
        relations: {
          shop: true,
          eventProducts: true,
        },
        where: {
          id: productIdList[i],
        },
      });
      if (!product) {
        return new Response(
          HttpStatusCode.BAD_REQUEST,
          'Some products not exist'
        );
      }
      if (product.shop.id != user.shop.id) {
        return new Response(
          HttpStatusCode.BAD_REQUEST,
          'Some products are not yours'
        );
      }
      const eventProduct = await eventProductRepository.findOne({
        relations: {
          product: true,
          event: true,
        },
        where: {
          status: StatusEnum.ACTIVE,
          product: { id: product.id },
          event: { id: eventId },
        },
      });
      if (!eventProduct)
        return new Response(
          HttpStatusCode.BAD_REQUEST,
          'Some products not exist in this event'
        );
      else {
        eventProductListThatEligible.push(eventProduct);
      }
    }
    for (let i = 0; i < eventProductListThatEligible.length; i++) {
      await eventProductRepository.update(eventProductListThatEligible[i].id, {
        status: StatusEnum.INACTIVE
      });
    }
    return new Response(HttpStatusCode.OK, 'Delete successfully!');
  }

  static async showAllProductsOfEvent(eventId: number) {
    const eventRepository = ShopPDataSource.getRepository(Event);
    const eventProductRepository = ShopPDataSource.getRepository(EventProduct);
    const event = await eventRepository.findOne({
      select: {
        status: false
      },
      where: {
        id: eventId,
        status: StatusEnum.ACTIVE
      }
    })
    if (!event)
      return new Response(HttpStatusCode.BAD_REQUEST, 'Event not exist!');
    if (
      event.status == StatusEnum.INACTIVE ||
      event.status == StatusEnum.LOCKED
    )
      return new Response(HttpStatusCode.BAD_REQUEST, 'Event is inactive!');
    const eventProducts = await eventProductRepository.find({
      select: {
        status: false,
      },
      where: {
        status: StatusEnum.ACTIVE,
        event: {id: eventId},
      },
    });
    if (eventProducts.length == 0)
      return new Response(HttpStatusCode.BAD_REQUEST, 'No products available!');
    return new Response(
      HttpStatusCode.OK,
      'Show products successfully!',
      eventProducts
    );
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

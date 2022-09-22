import { User } from './../entities/user';
import { Customer } from './../entities/customer';
import { validate } from 'class-validator';
import { ShopPDataSource } from '../data';
import {
  StatusEnum,
  HttpStatusCode,
  GenderEnum,
  RoleEnum,
} from '../utils/shopp.enum';
import Response from '../utils/response';
import CartModel from './cart';

export default class CustomerModel {
  static async listAll() {
    const customerRepository = ShopPDataSource.getRepository(Customer);
    const customers = await customerRepository.find({
      relations: {
        user: true,
      },
      select: {
        id: true,
        name: true,
        avatar: true,
        gender: true,
        dob: true,
        placeOfDelivery: true,
        user: {
          id: true,
          email: true,
          phone: true,
        },
        // not need following shops
      },
      where: {
        user: { status: StatusEnum.ACTIVE },
      },
    });
    return customers ? customers : false;
  }

  static async getOneById(customerId: string, user: User) {
    let customerPayload = user.customer;
    let customer;
    const customerRepository = ShopPDataSource.getRepository(Customer);
    // check role of user
    if (
      user.role.role == RoleEnum.CUSTOMER ||
      user.role.role == RoleEnum.SHOP
    ) {
      if (customerPayload.id != customerId) {
        customer = await customerRepository.findOne({
          relations: {
            user: true,
          },
          select: {
            name: true,
            avatar: true,
            gender: true,
            dob: true,
          },
          where: {
            id: customerId,
            user: { status: StatusEnum.ACTIVE },
          },
        });
      } else
        customer = {
          id: customerPayload.id,
          name: customerPayload.name,
          dob: customerPayload.dob,
          avatar: customerPayload.avatar,
          user: {
            id: user.id,
            email: user.email,
            phone: user.phone,
          },
        };
    } else {
      customer = await customerRepository.findOne({
        relations: {
          user: true,
        },
        select: {
          name: true,
          avatar: true,
          gender: true,
          dob: true,
          user: {
            id: true,
            email: true,
            phone: true,
          },
        },
        where: {
          id: customerId,
          user: { status: StatusEnum.ACTIVE },
        },
      });
    }
    return customer ? customer : false;
  }

  static async postNew(
    name: string,
    gender: GenderEnum,
    dob: Date,
    placeOfDelivery: string,
    user: User
  ) {
    const customerRepository = ShopPDataSource.getRepository(Customer);
    // check user has already have customer or not
    if (user.customer != null && user.customer != undefined) {
      return new Response(
        HttpStatusCode.BAD_REQUEST,
        `Customer has already existed`
      );
    }
    let customer = await customerRepository.save({
      name,
      gender,
      dob,
      placeOfDelivery,
      user,
    });
    CartModel.postNew(customer.id, {});
    return new Response(
      HttpStatusCode.CREATED,
      'Create new customer successfully!',
      {
        id: customer.id,
        name: customer.name,
        gender: customer.gender,
        dob: customer.dob,
        placeOfDelivery: customer.placeOfDelivery,
        user: {
          id: user.id,
          email: user.email,
          phone: user.phone,
        },
      }
    );
  }

  static async edit(
    name: string,
    gender: GenderEnum,
    dob: Date,
    placeOfDelivery: string,
    user: User
  ) {
    // find customer on database
    const customerRepository = ShopPDataSource.getRepository(Customer);
    if (user.customer == null)
      return new Response(
        HttpStatusCode.BAD_REQUEST,
        'User has not have customer yet!'
      );
    const result = await customerRepository.update(
      {
        id: user.customer.id,
      },
      {
        name,
        gender,
        dob,
        placeOfDelivery,
      }
    );
    if (result.affected == 1) {
      return new Response(HttpStatusCode.OK, 'Edit customer successfully!');
    } else {
      return new Response(HttpStatusCode.BAD_REQUEST, 'Edit customer failed !');
    }
  }
}

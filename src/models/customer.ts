import { User } from './../entities/user';
import { Customer } from './../entities/customer';
import { validate } from 'class-validator';
import { ShopPDataSource } from '../data';
import { StatusEnum, HttpStatusCode, GenderEnum, RoleEnum } from '../utils/shopp.enum';
import Response from '../utils/response';

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
        // not need following shops
      },
      where: {
        user: { status: StatusEnum.ACTIVE },
      },
    });
    return customers ? customers : false;
  }

  static async getOneById(customerId: string) {
    const customerRepository = ShopPDataSource.getRepository(Customer);

    const customer = await customerRepository.findOne({
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
        followingShops: true,
      },
      where: {
        id: customerId,
        user: { status: StatusEnum.ACTIVE },
      },
    });
    return customer ? customer : false;
  }

  static async postNew(
    name: string,
    gender: GenderEnum,
    dob: Date,
    placeOfDelivery: string,
    userId: number
  ) {
    const userRepository = ShopPDataSource.getRepository(User);
    const customerRepository = ShopPDataSource.getRepository(Customer);

    let userID = await userRepository.findOne({
      relations: {
        customer: true,
        roles: true,
      },
      where: {
        id: userId,
        status: StatusEnum.ACTIVE,
      },
    });

    if (userID === null) {
      return new Response(HttpStatusCode.BAD_REQUEST, 'UserId doesnt exist');
    }

    // check userID used or not

    if (userID.customer != undefined) {
      return new Response(
        HttpStatusCode.BAD_REQUEST,
        `Customer with userId ${userId} has already existed`
      );
    }

    let customer = await customerRepository.save({
      name,
      gender,
      dob,
      placeOfDelivery,
      user: userID,
    });

    return new Response(
      HttpStatusCode.CREATED,
      'Create new customer successfully!',
      customer
    );
  }

  static async edit(
    id: string,
    name: string,
    gender: GenderEnum,
    dob: Date,
    placeOfDelivery: string
  ) {
    // find customer on database
    const customerRepository = ShopPDataSource.getRepository(Customer);
    const customerId = await customerRepository.findOne({
      where: {
        id,
      },
    });
    if (customerId === null)
      return new Response(
        HttpStatusCode.BAD_REQUEST,
        "Customer Id doesn't exist"
      );

    const result = await customerRepository.update(
      {
        id,
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

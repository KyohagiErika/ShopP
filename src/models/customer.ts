import { Shop } from './../entities/shop';
import { User } from './../entities/user';
import { Customer } from './../entities/customer';
import { ShopPDataSource } from '../data';
import {
  StatusEnum,
  HttpStatusCode,
  GenderEnum,
  RoleEnum,
} from '../utils/shopp.enum';
import Response from '../utils/response';
import CartModel from './cart';
import { LocalFile } from '../entities/localFile';
import { deleteFile } from '../utils';
import { isNotEmpty } from 'class-validator/types/decorator/decorators';
import UploadModel from './upload';
import { ModelService } from '../utils/decorators';
import { EntityManager } from 'typeorm';
import { Cart } from '../entities/cart';

export default class CustomerModel {
  static async listAll() {
    const customerRepository = ShopPDataSource.getRepository(Customer);
    const customers = await customerRepository.find({
      relations: {
        avatar: true,
        shopsFollowed: true,
      },
      select: {
        id: true,
        name: true,
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

  static async getOneById(customerId: string, user: User) {
    let customerPayload = user.customer;
    return customerPayload;
    let customer;
    const customerRepository = ShopPDataSource.getRepository(Customer);

    if (user.role.role == RoleEnum.ADMIN) {
      customer = await customerRepository.findOne({
        relations: {
          user: true,
          avatar: true,
          shopsFollowed: true,
        },
        select: {
          id: true,
          name: true,
          gender: true,
          dob: true,
        },
        where: {
          id: customerId,
          user: { status: StatusEnum.ACTIVE },
        },
      });
    } else if (customerPayload == null)
      return new Response(
        HttpStatusCode.REDIRECT,
        'User has not have customer yet!'
      );
    else if (customerPayload.id != customerId) {
      customer = await customerRepository.findOne({
        relations: {
          avatar: true,
        },
        select: {
          id: true,
          name: true,
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
        gender: customerPayload.gender,
        user: {
          id: user.id,
          email: user.email,
          phone: user.phone,
        },
      };
    return customer ? customer : false;
  }

  @ModelService()
  static async postNew(
    transactionalEntityManager: EntityManager,
    name: string,
    gender: GenderEnum,
    dob: Date,
    placeOfDelivery: string,
    user: User,
    avatar: Express.Multer.File
  ): Promise<Response> {
    if (user.role.role == RoleEnum.ADMIN)
      return new Response(
        HttpStatusCode.BAD_REQUEST,
        `Unauthorized role. Admin can not create customer role!`
      );
    const localFile: LocalFile = await UploadModel.upload(avatar);

    // check user has already have customer or not
    if (user.customer != null && user.customer != undefined) {
      return new Response(
        HttpStatusCode.BAD_REQUEST,
        `Customer has already existed.`
      );
    }
    const customerRepository =
      transactionalEntityManager.getRepository(Customer);
    const customerEntity = new Customer();
    customerEntity.name = name;
    customerEntity.gender = gender;
    customerEntity.dob = dob;
    customerEntity.placeOfDelivery = placeOfDelivery;
    customerEntity.user = user;
    customerEntity.avatar = localFile;

    const customer = await customerRepository.save(customerEntity);

    await transactionalEntityManager.getRepository(Cart).save({
      customer: customer,
    });
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
    user: User,
    file: Express.Multer.File
  ) {
    // find customer on database
    const customerRepository = ShopPDataSource.getRepository(Customer);
    const localFileRepository = ShopPDataSource.getRepository(LocalFile);

    if (user.customer == null)
      return new Response(
        HttpStatusCode.REDIRECT,
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

    const localFileEdit = await localFileRepository.update(
      {
        id: user.customer.avatar.id,
      },
      {
        filename: file.filename,
        mimetype: file.mimetype,
        path: file.path,
      }
    );

    deleteFile(user.customer.avatar.path);

    if (result.affected == 1 && localFileEdit.affected == 1) {
      return new Response(HttpStatusCode.OK, 'Edit customer successfully!');
    } else {
      return new Response(HttpStatusCode.BAD_REQUEST, 'Edit customer failed !');
    }
  }

  static async followShop(user: User, shopId: string) {
    if (user.role.role == RoleEnum.ADMIN)
      return new Response(
        HttpStatusCode.BAD_REQUEST,
        'Unauthorized error. Invalid role!'
      );
    const shopRepository = ShopPDataSource.getRepository(Shop);
    const customerRepository = ShopPDataSource.getRepository(Customer);
    const shop = await shopRepository.findOne({
      select: {
        id: true,
        followersNumber: true,
      },
      where: {
        id: shopId,
      },
    });
    if (shop == null)
      return new Response(HttpStatusCode.BAD_REQUEST, 'unavailable shop ID');
    const customer = await customerRepository.findOne({
      relations: {
        shopsFollowed: true,
      },
      select: {
        id: true,
      },
      where: {
        id: user.customer.id,
      },
    });
    if (customer == null)
      return new Response(HttpStatusCode.BAD_REQUEST, 'customer not exist');
    for (let item of customer.shopsFollowed) {
      if (item.id == shopId)
        return new Response(
          HttpStatusCode.BAD_REQUEST,
          'shop already followed!'
        );
    }
    shop.followersNumber++;
    customer.shopsFollowed.push(shop);
    customerRepository.save(customer);
    shopRepository.save(shop);
    return new Response(HttpStatusCode.OK, 'follow shop successfully!');
  }

  static async unfollowShop(user: User, shopId: string) {
    if (user.role.role == RoleEnum.ADMIN)
      return new Response(
        HttpStatusCode.BAD_REQUEST,
        'Unauthorized error. Invalid role!'
      );
    const shopRepository = ShopPDataSource.getRepository(Shop);
    const customerRepository = ShopPDataSource.getRepository(Customer);
    const shop = await shopRepository.findOne({
      select: {
        id: true,
        followers: true,
      },
      where: {
        id: shopId,
      },
    });
    if (shop == null)
      return new Response(HttpStatusCode.BAD_REQUEST, 'unavailable shop ID');
    const customer = await customerRepository.findOne({
      relations: {
        shopsFollowed: true,
      },
      select: {
        id: true,
      },
      where: {
        id: user.customer.id,
      },
    });
    if (customer == null)
      return new Response(HttpStatusCode.BAD_REQUEST, 'customer not exist');
    let length = customer.shopsFollowed.length;
    customer.shopsFollowed = customer.shopsFollowed.filter(item => {
      return item.id != shopId;
    });
    if (length == customer.shopsFollowed.length)
      return new Response(
        HttpStatusCode.BAD_REQUEST,
        'shop is not followed yet!'
      );
    shop.followersNumber--;
    await customerRepository.save(customer);
    await shopRepository.save(shop);
    return new Response(HttpStatusCode.OK, 'unfollow shop successfully!!');
  }

  static async showFollowedShopsList(user: User) {
    if (user.role.role == RoleEnum.ADMIN)
      return new Response(
        HttpStatusCode.BAD_REQUEST,
        'Unauthorized error. Invalid role!'
      );
    const customerRepository = ShopPDataSource.getRepository(Customer);
    const customer = await customerRepository.findOne({
      relations: {
        shopsFollowed: true,
      },
      select: {
        shopsFollowed: {
          id: true,
          name: true,
          star: true,
          followers: true,
        },
      },
      where: {
        id: user.customer.id,
      },
    });
    if (customer == null)
      return new Response(HttpStatusCode.BAD_REQUEST, 'customer not exist!');
    if (customer.shopsFollowed.length == 0)
      return new Response(HttpStatusCode.OK, 'no shop followed now!', []);
    return new Response(
      HttpStatusCode.OK,
      'show followed shops successfully!',
      customer.shopsFollowed
    );
  }
}

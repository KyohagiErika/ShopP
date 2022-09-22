import { ShopPDataSource } from '../data';
import { User } from '../entities/user';
import { Shop } from '../entities/shop';
import { StatusEnum, HttpStatusCode, RoleEnum } from '../utils/shopp.enum';
import Response from '../utils/response';
import { UserRole } from '../entities/userRole';
import { Like } from 'typeorm';

const shopRepository = ShopPDataSource.getRepository(Shop);
const userRoleRepository = ShopPDataSource.getRepository(UserRole);

export default class ShopModel {
  static async listAll() {
    const shops = await shopRepository.find({
      relations: {
        user: true
      },
      select: {
        name: true,
        avatar: true,
        email: true,
        phone: true,
        placeOfReceipt: true,
        star: true,
        followers: true,
        user: {
          email: true,
          phone: true
        }
      },
      where: {
        user: { status: StatusEnum.ACTIVE },
      },
    });
    return shops && shops.length > 0 ? shops : false;
  }

  static async getOneById(id: string) {
    const shop = await shopRepository.find({
      select: {
        name: true,
        avatar: true,
        email: true,
        phone: true,
        placeOfReceipt: true,
        star: true,
        followers: true,
      },
      where: {
        id: id,
        user: { status: StatusEnum.ACTIVE },
      },
    });
    return shop ? shop : false;
  }
  
  static async searchShop(name: string) {
    const shop = await shopRepository.find({
      select: {
        name: true,
        avatar: true,
        email: true,
        phone: true,
        placeOfReceipt: true,
        star: true,
        followers: true,
      },
      where: {
        name: Like(`%${name}%`),
        user: { status: StatusEnum.ACTIVE },
      },
    });
    return shop ? shop : false;
  }

  static async postNew(
    name: string,
    avatar: number,
    user: User,
    email: string,
    phone: string,
    placeOfReceipt: string
  ) {
    // const userRepository = ShopPDataSource.getRepository(User);
    // const user = await userRepository.findOne({
    //   relations: {
    //     role: true,
    //   },
    //   select: {
    //     id: true,
    //     role: {
    //       role: true,
    //     },
    //   },
    //   where: {
    //     id: userId,
    //     status: StatusEnum.ACTIVE,
    //     role: {role: RoleEnum.CUSTOMER},
    //   },
    // });
    if (user.role.role == 1) {
      return new Response(HttpStatusCode.BAD_REQUEST, 'User is already Shop.');
    } else {
      let shop = new Shop();
      shop.name = name;
      shop.avatar = avatar;
      shop.email = email;
      shop.phone = phone;
      shop.placeOfReceipt = placeOfReceipt;
      shop.user = user;

      await shopRepository.save(shop);
      await userRoleRepository.update(
        { id: user.id },
        { role: RoleEnum.SHOP }
      );

      return new Response(
        HttpStatusCode.CREATED,
        'Create new shop successfully!',
         {name: shop.name, avatar: shop.avatar, email: shop.email, phone: shop.phone, placeOfReceipt: shop.placeOfReceipt}
      );
    }
  }

  static async edit(
    id: string,
    name: string,
    avatar: number,
    email: string,
    phone: string,
    placeOfReceipt: string
  ) {
    const shop = await shopRepository.findOne({
      
      where: {
        id: id,
        user: { status: StatusEnum.ACTIVE, role: {role: RoleEnum.SHOP}
      },
      }
    });
    if (shop == null) {
      return new Response(HttpStatusCode.BAD_REQUEST, 'Shop is invalid.');
    } else {
      const shopEdit = await shopRepository.update(
        { id: id },
        {
          name: name,
          avatar: avatar,
          email: email,
          phone: phone,
          placeOfReceipt: placeOfReceipt,
        }
      );
      if (shopEdit.affected == 1) {
        return new Response(HttpStatusCode.OK, 'Edit shop successfully!');
      } else {
        return new Response(HttpStatusCode.BAD_REQUEST, 'Edit shop failed !');
      }
    }
  }
}

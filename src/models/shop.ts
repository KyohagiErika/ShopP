import { ShopPDataSource } from '../data';
import { User } from '../entities/user';
import { Shop } from '../entities/shop';
import { StatusEnum, HttpStatusCode, RoleEnum } from '../utils/shopp.enum';
import Response from '../utils/response';
import { UserRole } from '../entities/userRole';
import { Like } from 'typeorm';
import { LocalFile } from '../entities/localFile';
import { deleteFile } from '../utils';

const shopRepository = ShopPDataSource.getRepository(Shop);
const userRoleRepository = ShopPDataSource.getRepository(UserRole);
const localFileRepository = ShopPDataSource.getRepository(LocalFile);

export default class ShopModel {
  static async listAll() {
    const shops = await shopRepository.find({
      relations: {
        user: true,
        avatar: true,
      },
      where: {
        user: { status: StatusEnum.ACTIVE },
      },
    });
    return shops && shops.length > 0 ? shops : false;
  }

  static async getOneById(id: string) {
    const shop = await shopRepository.find({
      relations: {
        user: true,
        avatar: true,
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
      relations: {
        user: true,
        avatar: true,
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
    avatar: LocalFile,
    user: User,
    email: string,
    phone: string,
    placeOfReceipt: string
  ) {
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
      await userRoleRepository.update({ id: user.id }, { role: RoleEnum.SHOP });

      return new Response(
        HttpStatusCode.CREATED,
        'Create new shop successfully!',
        shop
      );
    }
  }

  static async edit(
    shop: Shop,
    name: string,
    file: Express.Multer.File,
    email: string,
    phone: string,
    placeOfReceipt: string
  ) {
    const shopEdit = await shopRepository.update(
      { id: shop.id },
      {
        name: name,
        email: email,
        phone: phone,
        placeOfReceipt: placeOfReceipt,
      }
    );

    const localFileEdit = await localFileRepository.update(
      {
        id: shop.avatar.id,
      },
      {
        filename: file.filename,
        mimetype: file.mimetype,
        path: file.path,
      }
    );

    deleteFile(shop.avatar.path);

    if (shopEdit.affected == 1 && localFileEdit.affected == 1) {
      return new Response(HttpStatusCode.OK, 'Edit shop successfully!');
    } else {
      return new Response(HttpStatusCode.BAD_REQUEST, 'Edit shop failed !');
    }
  }
}

import { validate } from "class-validator";
import { ShopPDataSource } from "../data";
import { User } from "../entities/user";
import { Shop } from "../entities/shop";
import { StatusEnum, RoleEnum } from "../utils/shopp.enum";
import user from "./user";
import { Entity } from "typeorm";

export default class ShopModel {
  static async listAll() {
    const shopRepository = ShopPDataSource.getRepository(Shop);
    const shops = await shopRepository.find({
      relations: {
        user: true,
        },
      select: {
        id: true,
        name: true,
        avatar: true,
        email: true,
        phone: true,
        placeOfReceipt: true,
        star: true,
        followers: true,
      }, 
      where: {
        user:{status: StatusEnum.ACTIVE}
      }
    });
    return shops && (shops.length > 0) ? shops : false;
  };

  static async getOneById(id: string) {
    const shopRepository = ShopPDataSource.getRepository(Shop);
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
          user:{status: StatusEnum.ACTIVE}
        }
      });
      return shop ? shop : false;
  }

  static async postNew(name: string, avatar: number, userId: number ,email: string, phone: string, placeOfReceipt: string) {
    //Get parameters from the body
    let shop = new Shop();
    shop.name = name;
    shop.avatar = avatar;
    shop.email = email;
    shop.phone = phone;
    shop.placeOfReceipt = placeOfReceipt;

    const userRepository = ShopPDataSource.getRepository(User);
      const user = await userRepository.findOneOrFail({
        select: {
          id: true,
        }, 
        where: {
          id: userId,
          status: StatusEnum.ACTIVE
        }
      });
      
    shop.user = user
    


    //Try to save. If fails, the username is already in use
    const shopRepository = ShopPDataSource.getRepository(Shop);
      await shopRepository.save(shop);
      
    return shop;
  
}

  static async edit(id: string, name: string, avatar: number, email: string, phone: string, placeOfReceipt: string) {
    //Try to find user on database
    const shopRepository = ShopPDataSource.getRepository(Shop);
    let shop: Shop | undefined | null;
    if (shop !== undefined && shop !== null) {
        shop = await shopRepository.findOne({ 
          where: {
            id: id,
            user:{status: StatusEnum.ACTIVE}
          } });
        if (shop) {
          //Validate the new values on model
          shop.name = name;
          shop.avatar = avatar;
          shop.email = email;
          shop.phone = phone;
          shop.placeOfReceipt = placeOfReceipt;

          //Try to safe, if fails, that means username already in use
         
            await shopRepository.save(shop);
            return shop;
        }
    };
    return true;
  }

  // static async delete(shopId: string) {
  //   const shopRepository = ShopPDataSource.getRepository(Shop);
  //   let shop: Shop | null | undefined;
  //   if (shop !== null && shop !== undefined) {
  //       shop = await shopRepository.findOne({ 
  //         where: {
  //           id: shopId,
  //           user:{status: StatusEnum.ACTIVE}
  //         } 
  //       });
  //       if(shop !== null) {
  //         user.status = {status : StatusEnum.INACTIVE};

  //         const errors = await validate(shop);
  //         if(errors.length > 0) return errors;

  //         await shopRepository.manager.save(shop)
  //         return shop;
  //       }
  //   };
  //   return true;
  // };
};

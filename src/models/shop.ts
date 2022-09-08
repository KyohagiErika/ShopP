import { validate } from "class-validator";
import { ShopPDataSource } from "../data";
import { User } from "../entities/user";
import { Shop } from "../entities/shop";
import { StatusEnum, RoleEnum, HttpStatusCode } from "../utils/shopp.enum";
import Response from '../utils/response'
import user from "./user";
import { Entity } from "typeorm";

const shopRepository = ShopPDataSource.getRepository(Shop);

export default class ShopModel {
  static async listAll() {
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
    const userRepository = ShopPDataSource.getRepository(User);
      const user = await userRepository.findOne({
        select: {
          id: true,
        }, 
        where: {
          id: userId,
          status: StatusEnum.ACTIVE
        }
      });
      if (user == null) {
        return new Response(HttpStatusCode.BAD_REQUEST, 'Id not exist.')
      } else {
    //Get parameters from the body
    let shop = new Shop();
    shop.name = name;
    shop.avatar = avatar;
    shop.email = email;
    shop.phone = phone;
    shop.placeOfReceipt = placeOfReceipt;
    shop.user = user
    
      await shopRepository.save(shop);
      
      return new Response(HttpStatusCode.CREATED, "Create new shop successfully!", shop);
      }
  
}

  static async edit(id: string, name: string, avatar: number, email: string, phone: string, placeOfReceipt: string) {
    const shop = await shopRepository.findOne({
      relations:{
        user: true,
      },
      select: {
        id: true,
      }, 
      where: {
        id: id,
        user: {status: StatusEnum.ACTIVE}

      }
    });
    if (shop == null) {
      return new Response(HttpStatusCode.BAD_REQUEST, 'Id not exist.')
    }else{
          await shopRepository.update({id: id}, 
            { name: name, avatar: avatar, email: email, phone: phone, placeOfReceipt: placeOfReceipt })
          return new Response(HttpStatusCode.OK, "Update shop successfully!", shop);

    }
  }    
    //Try to find user on database
    // const shopRepository = ShopPDataSource.getRepository(Shop);
    // let shop: Shop | undefined | null;
    // if (shop !== undefined && shop !== null) {
    //     shop = await shopRepository.findOne({ 
    //       where: {
    //         id: id,
    //         user:{status: StatusEnum.ACTIVE}
    //       } });
    //     if (shop) {
    //       //Validate the new values on model
    //       shop.name = name;
    //       shop.avatar = avatar;
    //       shop.email = email;
    //       shop.phone = phone;
    //       shop.placeOfReceipt = placeOfReceipt;

    //       //Try to safe, if fails, that means username already in use
         
    //         await shopRepository.save(shop);
    //         return shop;
    //     }
    // };
    // return true;


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

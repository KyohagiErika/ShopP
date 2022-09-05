import { validate } from "class-validator";
import { ShopPDataSource } from "../data";
import { User } from "../entities/user";
import { Shop } from "../entities/shop";
import { UserRole } from "../entities/userRole";
import { StatusEnum, RoleEnum } from "../utils/shopp.enum";
import { LocalFile } from "../entities/localFile";
import user from "./user";

export default class ShopModel {
  static async listAll() {
    const shopRepository = ShopPDataSource.getRepository(Shop);
    const shops = await shopRepository.find({
      relations: {
        user: true,
        avatar: true,
        },
      select: {
        id: true,
        name: true,
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

  static async getOneById(shopId: string) {
    const shopRepository = ShopPDataSource.getRepository(Shop);
    try {
      const shop = await shopRepository.findOneOrFail({
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
          id: shopId,
          user:{status: StatusEnum.ACTIVE}
        }
      });
      return shop ? shop : false;
    } catch (error) {
      return error;
    };
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
    try {
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
    

    //Validade if the parameters are ok
    const errorsShop = await validate(shop);
    if (errorsShop.length > 0) {
      //res.status(400).send(errors);
      return errorsShop;
    }


    //Try to save. If fails, the username is already in use
    const shopRepository = ShopPDataSource.getRepository(Shop);
    
    try {
      await shopRepository.manager.save(shop);
      
    } catch (e) {
      return e;
    }
    //If all ok, send 201 response
    //res.status(201).send("User created");
    return shop;
  } catch (e) {
    return e;
  };
}

  static async edit(id: string, name: string, avatar: number, email: string, phone: string, placeOfReceipt: string) {
    //Try to find user on database
    const shopRepository = ShopPDataSource.getRepository(Shop);
    let shop: Shop | undefined | null;
    if (shop !== undefined && shop !== null) {
      try {
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

          const errors = await validate(shop);
          if (errors.length > 0) {
            //res.status(400).send(errors);
            return errors;
          }

          //Try to safe, if fails, that means username already in use
          try {
            await shopRepository.save(shop);
          } catch (e) {
            return e;
          }
        }
        //After all send a 204 (no content, but accepted) response
        //res.status(204).send();
        return true;
      } catch (error) {
        //If not found, send a 404 response
        //res.status(404).send("User not found");
        return error;
      }
    };
  }

  static async delete(shopId: string) {
    const shopRepository = ShopPDataSource.getRepository(Shop);
    let shop: Shop | null | undefined;
    if (shop !== null && shop !== undefined) {
      try {
        shop = await shopRepository.findOne({ 
          where: {
            id: shopId,
            user:{status: StatusEnum.ACTIVE}
          } 
        });
        if(shop !== null) {
          user.status = {status : StatusEnum.INACTIVE};

          const errors = await validate(shop);
          if(errors.length > 0) return errors;

          await shopRepository.manager.save(shop)
          return shop;
        } else return false;
        
      } catch (error) {
        //res.status(404).send("User not found");
        return error;
      }
      //After all send a 204 (no content, but accepted) response
      //res.status(204).send();     
    }
  };
};

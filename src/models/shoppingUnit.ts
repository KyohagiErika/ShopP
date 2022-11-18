import { ShopPDataSource } from '../data';
import { Payment } from '../entities/payment';
import { ShoppingUnit } from '../entities/shoppingUnit';
import Response from '../utils/response';
import { HttpStatusCode } from '../utils/shopp.enum';

const ShoppingUnitRepository = ShopPDataSource.getRepository(ShoppingUnit);

export default class ShoppingUnitModel {
  static async listAll() {
    const shoppingUnit = await ShoppingUnitRepository.find({
      select: {
        id: true,
        name: true,
      },
    });
    return shoppingUnit && shoppingUnit.length > 0 ? shoppingUnit : false;
  }

  static async getOneById(id: number) {
    const shoppingUnit = await ShoppingUnitRepository.findOne({
      select: {
        id: true,
        name: true,
      },
      where: {
        id: id,
      },
    });
    return shoppingUnit ? shoppingUnit : false;
  }

  static async postNew(name: string) {
    const payment = await ShoppingUnitRepository.findOne({
      select: {
        id: true,
        name: true,
      },
      where: {
        name: name,
      },
    });

    if (!(payment == null)) {
      return new Response(
        HttpStatusCode.BAD_REQUEST,
        'Shopping unit already exist !',
        payment
      );
    } else {
      let newShoppingUnit = new Payment();
      newShoppingUnit.name = name;
      await ShoppingUnitRepository.save(newShoppingUnit);

      return new Response(
        HttpStatusCode.CREATED,
        'Create new shopping unit successfully!',
        newShoppingUnit
      );
    }
  }
}

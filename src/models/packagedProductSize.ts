import { ShopPDataSource } from '../data';
import { Product } from '../entities/product';
import { HttpStatusCode, ProductEnum } from '../utils/shopp.enum';
import Response from '../utils/response';
import { PackagedProductSize } from '../entities/packagedProductSize';

const packagedProductSizeReposity = ShopPDataSource.getRepository(PackagedProductSize);

export default class PackagedProductSizeModel {
  static async listAll() {
    const packagedProductSize = await packagedProductSizeReposity.find({
      relations: {
        product: true
      },
      select: {
        weight: true,
        lenght: true,
        width: true,
        height: true,
        product: {
          name: true,
          detail: true,
          amount: true,
        },
      },
    });
    return packagedProductSize && packagedProductSize.length > 0 ? packagedProductSize : false;
  }

  static async getOneById(id: number) {
    const packagedProductSize = await packagedProductSizeReposity.find({
      relations: {
        product: true
      },
      select: {
        weight: true,
        lenght: true,
        width: true,
        height: true,
        product: {
          name: true,
          detail: true,
          amount: true,
        },
      },
      where: {
        id: id,
      },
    });
    return packagedProductSize ? packagedProductSize : false;
  }

  static async postNew(
    productId: string,
    weight: number,
    lenght: number,
    width: number,
    height: number,
  ) {
    const productRepository = ShopPDataSource.getRepository(Product);
    const product = await productRepository.findOne({
      select: {
        id: true,
        name: true
      },
      where: [{
        id: productId,
        status: ProductEnum.AVAILABLE
      },
      {
        id: productId,
        status: ProductEnum.OUT_OF_ORDER
      }],
    });
    if (product == null) {
      return new Response(
        HttpStatusCode.BAD_REQUEST,
        'ProductId not exist.'
      );
    } else {
      let packagedProductSize = new PackagedProductSize();
      packagedProductSize.product = product;
      packagedProductSize.weight = weight;
      packagedProductSize.lenght = lenght;
      packagedProductSize.width = width;
      packagedProductSize.height = height;
      await packagedProductSizeReposity.save(packagedProductSize);

      return new Response(
        HttpStatusCode.CREATED,
        'Add packaged size successfully!',
        packagedProductSize
      );
    }
  }

  static async edit(
    id: number,
    weight: number,
    lenght: number,
    width: number,
    height: number,
  ) {
    const packagedProductSize = await packagedProductSizeReposity.findOne({
      where: [{
        id: id,
        product: { status: ProductEnum.AVAILABLE }
      },
      {
        id: id,
        product: { status: ProductEnum.OUT_OF_ORDER }
      },
      ]
    });
    if (packagedProductSize == null) {
      return new Response(HttpStatusCode.BAD_REQUEST, "Id not exit !");
    } else {
      const packagedProductSizeEdit = await packagedProductSizeReposity.update({ id: id }, { weight: weight, lenght: lenght, width: width, height: height });
      if (packagedProductSizeEdit.affected == 1) {
        return new Response(HttpStatusCode.OK, 'Edit packaged size successfully!');
      } else {
        return new Response(
          HttpStatusCode.BAD_REQUEST,
          'Edit packaged size failed !'
        );
      }

    }
  }

}

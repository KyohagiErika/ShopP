import { ShopPDataSource } from '../data';
import { Product } from '../entities/product';
import { HttpStatusCode, ProductEnum } from '../utils/shopp.enum';
import Response from '../utils/response';
import { PackagedProductSize } from '../entities/packagedProductSize';

const packagedProductSizeRepository =
  ShopPDataSource.getRepository(PackagedProductSize);
const productRepository = ShopPDataSource.getRepository(Product);

export default class PackagedProductSizeModel {
  static async listAll() {
    const packagedProductSize = await packagedProductSizeRepository.find({
      select: {
        weight: true,
        length: true,
        width: true,
        height: true,
      },
    });
    return packagedProductSize && packagedProductSize.length > 0
      ? packagedProductSize
      : false;
  }

  static async getOneById(id: number) {
    const packagedProductSize = await packagedProductSizeRepository.findOne({
      select: {
        weight: true,
        length: true,
        width: true,
        height: true,
      },
      where: {
        id: id,
      },
    });
    return packagedProductSize ? packagedProductSize : false;
  }

  static async getOneByProductId(id: string) {
    const packagedProductSize = await packagedProductSizeRepository.findOne({
      select: {
        weight: true,
        length: true,
        width: true,
        height: true,
      },
      where: {
        product: { id: id },
      },
    });
    return packagedProductSize ? packagedProductSize : false;
  }

  static async postNew(
    productId: string,
    weight: number,
    length: number,
    width: number,
    height: number,
    shopId: string
  ) {
    const productRepository = ShopPDataSource.getRepository(Product);
    const product = await productRepository.findOne({
      select: {
        id: true,
        name: true,
      },
      where: [
        {
          id: productId,
          status: ProductEnum.AVAILABLE,
        },
        {
          id: productId,
          status: ProductEnum.OUT_OF_ORDER,
        },
      ],
    });
    if (product == null) {
      return new Response(HttpStatusCode.BAD_REQUEST, 'Product not exist.');
    } else {
      const findShop = await productRepository.findOne({
        where: {
          shop: { id: shopId },
          id: productId,
        },
      });
      if (!findShop) {
        return new Response(
          HttpStatusCode.BAD_REQUEST,
          'Product not exist in shop.'
        );
      }
      const findPackaged = await packagedProductSizeRepository.findOne({
        where: {
          product: { id: product.id },
        },
      });
      if (findPackaged) {
        return new Response(
          HttpStatusCode.BAD_REQUEST,
          'Product already have package size!'
        );
      } else {
        let packagedProductSize = new PackagedProductSize();
        packagedProductSize.product = product;
        packagedProductSize.weight = weight;
        packagedProductSize.length = length;
        packagedProductSize.width = width;
        packagedProductSize.height = height;
        await packagedProductSizeRepository.save(packagedProductSize);
        return new Response(
          HttpStatusCode.CREATED,
          'Add packaged size successfully!',
          { weight: weight, length: length, width: width, height: height }
        );
      }
    }
  }

  static async edit(
    id: number,
    weight: number,
    length: number,
    width: number,
    height: number,
    shopId: string
  ) {
    const packagedProductSize = await packagedProductSizeRepository.findOne({
      where: [
        {
          id: id,
          product: { status: ProductEnum.AVAILABLE },
        },
        {
          id: id,
          product: { status: ProductEnum.OUT_OF_ORDER },
        },
      ],
    });
    if (packagedProductSize == null) {
      return new Response(HttpStatusCode.BAD_REQUEST, 'Product not exit !');
    } else {
      const findShop = await productRepository.findOne({
        relations: {
          productAdditionalInfo: true,
        },
        where: {
          shop: { id: shopId },
          packagedProductSize: { id: id },
        },
      });
      if (!findShop) {
        return new Response(
          HttpStatusCode.BAD_REQUEST,
          'Product not exist in shop.'
        );
      }
      const packagedProductSizeEdit =
        await packagedProductSizeRepository.update(
          { id: id },
          { weight: weight, length: length, width: width, height: height }
        );
      if (packagedProductSizeEdit.affected == 1) {
        return new Response(
          HttpStatusCode.OK,
          'Edit packaged size successfully!'
        );
      } else {
        return new Response(
          HttpStatusCode.BAD_REQUEST,
          'Edit packaged size failed !'
        );
      }
    }
  }
}

import { ShopPDataSource } from '../data';
import { Product } from '../entities/product';
import { HttpStatusCode, ProductEnum } from '../utils/shopp.enum';
import Response from '../utils/response';
import { ProductAdditionalInfo } from '../entities/productAdditionalInfo';

const productAddtionInfoReposity = ShopPDataSource.getRepository(ProductAdditionalInfo);

export default class ProductAdditionInfoModel {
  static async listAll() {
    const productAdditionalInfo = await productAddtionInfoReposity.find({
      relations: {
        product: true
      },
      select: {
        key: true,
        value: true,
        product: {
          name: true,
          detail: true,
          amount: true,
        },
      },
    });
    return productAdditionalInfo && productAdditionalInfo.length > 0 ? productAdditionalInfo : false;
  }

  static async getOneById(id: number) {
    const productAdditionalInfo = await productAddtionInfoReposity.find({
      relations: {
        product: true
      },
      select: {
        key: true,
        value: true,
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
    return productAdditionalInfo ? productAdditionalInfo : false;
  }

  static async postNew(
    productId: string,
    key: string,
    value: string,
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
      let productAdditionalInfo = new ProductAdditionalInfo();
      productAdditionalInfo.product = product;
      productAdditionalInfo.key = key;
      productAdditionalInfo.value = value;
      await productAddtionInfoReposity.save(productAdditionalInfo);

      return new Response(
        HttpStatusCode.CREATED,
        'Add product information successfully!',
        productAdditionalInfo
      );
    }
  }

  static async edit(
    id: number,
    key: string,
    value: string
  ) {
    const productAdditonalInfo = await productAddtionInfoReposity.findOne({
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
    if (productAdditonalInfo == null) {
      return new Response(HttpStatusCode.BAD_REQUEST, "Id not exit !");
    } else {
      const productAdditionalInfoEdit = await productAddtionInfoReposity.update({ id: id }, { key: key, value: value });
      if (productAdditionalInfoEdit.affected == 1) {
        return new Response(HttpStatusCode.OK, 'Edit product additonal infomation successfully!');
      } else {
        return new Response(
          HttpStatusCode.BAD_REQUEST,
          'Edit product additonal infomation failed !'
        );
      }

    }
  }

}

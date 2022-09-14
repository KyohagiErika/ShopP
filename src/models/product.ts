import { ShopPDataSource } from '../data';
import { Product } from '../entities/product';
import { Shop } from '../entities/shop';
import { HttpStatusCode, ProductEnum } from '../utils/shopp.enum';
import Response from '../utils/response';
import { Category } from '../entities/category';
import { Like, MoreThanOrEqual } from 'typeorm';

const productRepository = ShopPDataSource.getRepository(Product);

export default class ProductModel {
  static async listAll() {
    const product = await productRepository.find({
      relations: {
        shop: true,
        category: true,
      },
      select: {
        id: true,
        name: true,
        detail: true,
        amount: true,
        createdAt: true,
        status: true,
        sold: true,
        star: true,
      },
      where: [
        {
          status: ProductEnum.AVAILABLE,
        },
        { status: ProductEnum.OUT_OF_ORDER },
      ],
    });
    return product && product.length > 0 ? product : false;
  }

  static async getOneById(id: string) {
    const product = await productRepository.find({
      relations: {
        shop: true,
        category: true,
      },
      select: {
        name: true,
        detail: true,
        amount: true,
        createdAt: true,
        status: true,
        sold: true,
        star: true,
      },
      where: [
        {
          id: id,
          status: ProductEnum.AVAILABLE,
        },
        {
          id: id,
          status: ProductEnum.OUT_OF_ORDER,
        },
      ],
    });
    return product ? product : false;
  }

  static async getOneByName(name: string) {
    const product = await productRepository.find({
      relations: {
        shop: true,
        category: true,
      },
      select: {
        name: true,
        detail: true,
        amount: true,
        createdAt: true,
        status: true,
        sold: true,
        star: true,
      },
      where: [
        {
          name: name,
          status: ProductEnum.AVAILABLE,
        },
        {
          name: name,
          status: ProductEnum.OUT_OF_ORDER,
        },
      ],
    });
    return product ? product : false;
  }

  static async getOneByCategory(categoryId: number) {
    const product = await productRepository.find({
      relations: {
        shop: true,
        category: true,
      },
      select: {
        name: true,
        detail: true,
        amount: true,
        createdAt: true,
        status: true,
        sold: true,
        star: true,
      },
      where: [
        {
          category: { id: categoryId },
          status: ProductEnum.AVAILABLE,
        },
        {
          category: { id: categoryId },
          status: ProductEnum.OUT_OF_ORDER,
        },
      ],
    });
    return product ? product : false;
  }

  static async getOneByCategoryName(name: string) {
    const product = await productRepository.find({
      relations: {
        shop: true,
        category: true,
      },
      select: {
        name: true,
        detail: true,
        amount: true,
        createdAt: true,
        status: true,
        sold: true,
        star: true,
      },

      where: [
        {
          category: { name: Like(name) },
          //category: {name: name},
          status: ProductEnum.AVAILABLE,
        },
        {
          category: { name: Like(name) },
          status: ProductEnum.OUT_OF_ORDER,
        },
      ],
    });
    return product ? product : false;
  }

  static async getOneByShop(shop: string) {
    const product = await productRepository.find({
      relations: {
        shop: true,
        category: true,
      },
      select: {
        name: true,
        detail: true,
        amount: true,
        createdAt: true,
        status: true,
        sold: true,
        star: true,
      },
      where: [
        {
          shop: { id: shop },
          status: ProductEnum.AVAILABLE,
        },
        {
          shop: { id: shop },
          status: ProductEnum.OUT_OF_ORDER,
        },
      ],
    });
    return product ? product : false;
  }

  static async postNew(
    shopId: string,
    name: string,
    categoryId: number,
    detail: string,
    amount: number,
    status: ProductEnum
  ) {
    const shopRepository = ShopPDataSource.getRepository(Shop);
    const shop = await shopRepository.findOne({
      select: {
        id: true,
      },
      where: {
        id: shopId,
      },
    });
    const categoryRepository = ShopPDataSource.getRepository(Category);
    const category = await categoryRepository.findOne({
      select: {
        id: true,
      },
      where: {
        id: categoryId,
      },
    });
    if (shop == null || category == null) {
      return new Response(
        HttpStatusCode.BAD_REQUEST,
        'shopId or categoryId not exist.'
      );
    } else {
      let product = new Product();
      product.shop = shop;
      product.name = name;
      product.category = category;
      product.detail = detail;
      product.amount = amount;
      product.status = status;

      await productRepository.save(product);

      return new Response(
        HttpStatusCode.CREATED,
        'Create new shop successfully!',
        product
      );
    }
  }

  static async edit(
    id: string,
    name: string,
    categoryId: number,
    detail: string,
    amount: number,
    status: ProductEnum
  ) {
    const categoryRepository = ShopPDataSource.getRepository(Category);
    const category = await categoryRepository.findOne({
      select: {
        id: true,
      },
      where: {
        id: categoryId,
      },
    });
    if (category == null) {
      return new Response(HttpStatusCode.BAD_REQUEST, 'categoryId not exist.');
    }
    const product = await productRepository.findOne({
      relations: {
        shop: true,
      },
      select: {
        id: true,
      },
      where: {
        id: id,
      },
    });
    if (product == null) {
      return new Response(HttpStatusCode.BAD_REQUEST, 'Id not exist.');
    } else {
      const productEdit = await productRepository.update(
        { id: id },
        {
          name: name,
          category: category, //,{ id: categoryId }
          detail: detail,
          amount: amount,
          status: status,
        }
      );
      if (productEdit.affected == 1) {
        return new Response(HttpStatusCode.OK, 'Edit product successfully!');
      } else {
        return new Response(
          HttpStatusCode.BAD_REQUEST,
          'Edit product failed !'
        );
      }
    }
  }

  static async delete(productId: string) {
    const product = await productRepository.findOne({
      where: {
        id: productId,
      },
    });
    if (product == null) {
      return new Response(HttpStatusCode.BAD_REQUEST, 'Product not exist.');
    }

    const result = await productRepository.update(
      {
        id: productId,
        status: ProductEnum.AVAILABLE || ProductEnum.OUT_OF_ORDER,
      },
      { status: ProductEnum.DELETED }
    );
    if (result.affected == 1) {
      return new Response(HttpStatusCode.OK, 'Delete product successfully!');
    } else {
      return new Response(HttpStatusCode.BAD_REQUEST, 'Delete product failed!');
    }
  }
}

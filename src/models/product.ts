import { ShopPDataSource } from '../data';
import { Product } from '../entities/product';
import { Shop } from '../entities/shop';
import { HttpStatusCode, ProductEnum } from '../utils/shopp.enum';
import Response from '../utils/response';
import { Category } from '../entities/category';
import { Like } from 'typeorm';
import { LocalFile } from '../entities/localFile';
import { ProductImage } from '../entities/productImage';

const productRepository = ShopPDataSource.getRepository(Product);
const productImageRepository = ShopPDataSource.getRepository(ProductImage);

export default class ProductModel {
  static async listAll() {
    const product = await productRepository.find({
      relations: {
        shop: true,
        category: true,
        productImage: true,
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
        productImage: true,
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

  static async searchByName(name: string) {
    const product = await productRepository.find({
      relations: {
        shop: true,
        category: true,
        productImage: true,
      },

      where: [
        {
          name: Like(`%${name}%`),
          status: ProductEnum.AVAILABLE,
        },
        {
          name: Like(`%${name}%`),
          status: ProductEnum.OUT_OF_ORDER,
        },
      ],
    });
    return product ? product : false;
  }

  static async searchByCategory(categoryId: number) {
    const product = await productRepository.find({
      relations: {
        shop: true,
        category: true,
        productImage: true,
      },
      select: {
        name: true,
        detail: true,
        amount: true,
        status: true,
        quantity: true,
        sold: true,
        star: true,
        shop: { name: true },
        category: { name: true },
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

  static async searchByCategoryName(name: string) {
    const product = await productRepository.find({
      relations: {
        shop: true,
        category: true,
        productImage: true,
      },


      where: [
        {
          category: { name: Like(`%${name}%`) },
          status: ProductEnum.AVAILABLE,
        },
        {
          category: { name: Like(`%${name}%`) },
          status: ProductEnum.OUT_OF_ORDER,
        },
      ],
    });
    return product ? product : false;
  }

  static async searchByShop(shopId: string) {
    const product = await productRepository.find({
      relations: {
        shop: true,
        category: true,
        productImage: true,
      },

      where: [
        {
          shop: { id: shopId },
          status: ProductEnum.AVAILABLE,
        },
        {
          shop: { id: shopId },
          status: ProductEnum.OUT_OF_ORDER,
        },
      ],
    });
    return product ? product : false;
  }

  static async postNew(
    shop: Shop,
    name: string,
    categoryId: number,
    detail: string,
    amount: number,
    quantity: number,
    status: ProductEnum,
    productImages: LocalFile[]
  ) {
    const categoryRepository = ShopPDataSource.getRepository(Category);
    const category = await categoryRepository.findOne({
      where: {
        id: categoryId,
      },
    });
    if (category == null) {
      return new Response(HttpStatusCode.BAD_REQUEST, 'Category not exist.');
    } else {
      let product = new Product();
      product.shop = shop;
      product.name = name;
      product.category = category;
      product.detail = detail;
      product.amount = amount;
      product.quantity = quantity;
      product.status = status;
      await productRepository.save(product);

      productImages.forEach(async productImage => {
        await productImageRepository.insert({
          localFile: productImage,
          product: product,
        });
      });

      return new Response(
        HttpStatusCode.CREATED,
        'Create new product successfully!',
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
    quantity: number,
    status: ProductEnum
  ) {
    const categoryRepository = ShopPDataSource.getRepository(Category);
    const category = await categoryRepository.findOne({
      where: {
        id: categoryId,
      },
    });
    if (category == null) {
      return new Response(HttpStatusCode.BAD_REQUEST, 'category not exist.');
    }
    const product = await productRepository.findOne({
      where: {
        id: id,
      },
    });
    if (product == null) {
      return new Response(HttpStatusCode.BAD_REQUEST, 'product not exist.');
    } else {
      const productEdit = await productRepository.update(
        { id: id },
        {
          name: name,
          category: category,
          detail: detail,
          amount: amount,
          quantity: quantity,
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

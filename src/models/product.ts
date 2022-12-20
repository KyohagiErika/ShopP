import { ShopPDataSource } from '../data';
import { Product } from '../entities/product';
import { Shop } from '../entities/shop';
import { HttpStatusCode, ProductEnum } from '../utils/shopp.enum';
import Response from '../utils/response';
import { Category } from '../entities/category';
import { Between, Double, EntityManager, In, Like } from 'typeorm';
import { LocalFile } from '../entities/localFile';
import { ProductImage } from '../entities/productImage';
import { ModelService } from '../utils/decorators';

const productRepository = ShopPDataSource.getRepository(Product);

export default class ProductModel {
  static async listAll() {
    const product = await productRepository.find({
      relations: {
        shop: {
          avatar: true,
        },
        category: true,
        productImage: {
          localFile: true,
        },
      },
      select: {
        id: true,
        name: true,
        detail: true,
        amount: true,
        quantity: true,
        sold: true,
        star: true,
        status: true,
      },
      where: [
        {
          status: ProductEnum.AVAILABLE,
        },
        { status: ProductEnum.OUT_OF_ORDER },
      ],
      order: {
        star: 'DESC',
        sold: 'DESC',
        amount: 'ASC',
      },
    });
    return product && product.length > 0 ? product : false;
  }

  static async getOneById(id: string) {
    const product = await productRepository.findOne({
      relations: {
        shop: {
          avatar: true,
        },
        category: true,
        productImage: {
          localFile: true,
        },
      },
      select: {
        id: true,
        name: true,
        detail: true,
        amount: true,
        quantity: true,
        sold: true,
        star: true,
        status: true,
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
        shop: {
          avatar: true,
        },
        category: true,
        productImage: {
          localFile: true,
        },
      },
      select: {
        id: true,
        name: true,
        detail: true,
        amount: true,
        quantity: true,
        sold: true,
        star: true,
        status: true,
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
      order: {
        star: 'DESC',
        sold: 'DESC',
        amount: 'ASC',
      },
    });
    return product ? product : false;
  }

  static async searchByCategory(categoryId: number) {
    const product = await productRepository.find({
      relations: {
        shop: {
          avatar: true,
        },
        category: true,
        productImage: {
          localFile: true,
        },
      },
      select: {
        id: true,
        name: true,
        detail: true,
        amount: true,
        quantity: true,
        sold: true,
        star: true,
        status: true,
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
      order: {
        star: 'DESC',
        sold: 'DESC',
        amount: 'ASC',
      },
    });
    return product ? product : false;
  }

  static async searchByCategoryName(name: string) {
    const product = await productRepository.find({
      relations: {
        shop: {
          avatar: true,
        },
        category: true,
        productImage: {
          localFile: true,
        },
      },
      select: {
        id: true,
        name: true,
        detail: true,
        amount: true,
        quantity: true,
        sold: true,
        star: true,
        status: true,
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
      order: {
        star: 'DESC',
        sold: 'DESC',
        amount: 'ASC',
      },
    });
    return product ? product : false;
  }

  static async searchByShop(shopId: string) {
    const product = await productRepository.find({
      relations: {
        shop: {
          avatar: true,
        },
        category: true,
        productImage: {
          localFile: true,
        },
      },
      select: {
        id: true,
        name: true,
        detail: true,
        amount: true,
        quantity: true,
        sold: true,
        star: true,
        status: true,
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
      order: {
        star: 'DESC',
        sold: 'DESC',
        amount: 'ASC',
      },
    });
    return product ? product : false;
  }

  static async filterByPrice(max: number, min: number) {
    const product = await productRepository.find({
      relations: {
        shop: {
          avatar: true,
        },
        category: true,
        productImage: {
          localFile: true,
        },
      },
      select: {
        id: true,
        name: true,
        detail: true,
        amount: true,
        quantity: true,
        sold: true,
        star: true,
        status: true,
      },
      where: [
        {
          amount: Between(min, max),
          status: ProductEnum.AVAILABLE,
        },
        {
          amount: Between(min, max),
          status: ProductEnum.OUT_OF_ORDER,
        },
      ],
      order: {
        star: 'DESC',
        sold: 'DESC',
        amount: 'ASC',
      },
    });
    return product ? product : false;
  }

  static async filterByStar(max: number, min: number) {
    const product = await productRepository.find({
      relations: {
        shop: {
          avatar: true,
        },
        category: true,
        productImage: {
          localFile: true,
        },
      },
      select: {
        id: true,
        name: true,
        detail: true,
        amount: true,
        quantity: true,
        sold: true,
        star: true,
        status: true,
      },
      where: [
        {
          star: Between(min, max),
          status: ProductEnum.AVAILABLE,
        },
        {
          star: Between(min, max),
          status: ProductEnum.OUT_OF_ORDER,
        },
      ],
      order: {
        star: 'DESC',
        sold: 'DESC',
        amount: 'ASC',
      },
    });
    return product ? product : false;
  }

  static async filter(
    take: number,
    skip: number,
    categoryIds: number[] | null,
    price: any | null,
    star: any | null
  ) {
    let product: Product[] = [];
    if (categoryIds !== null) {
      if (star !== null) {
        if (price !== null) {
          product = await productRepository.find({
            relations: {
              shop: true,
              category: true,
              productImage: {
                localFile: true,
              },
            },
            select: {
              id: true,
              name: true,
              shop: {
                id: true,
              },
              detail: true,
              amount: true,
              quantity: true,
              sold: true,
              star: true,
              status: true,
            },
            where: {
              category: {
                id: In(categoryIds),
              },
              star: Between(star.min, star.max),
              amount: Between(price.min, price.max),
              status: In([ProductEnum.AVAILABLE, ProductEnum.OUT_OF_ORDER]),
            },
            order: {
              star: 'DESC',
              sold: 'DESC',
              amount: price.orderBy,
            },
            take: take,
            skip: skip,
          });
        } else {
          product = await productRepository.find({
            relations: {
              shop: true,
              category: true,
              productImage: {
                localFile: true,
              },
            },
            select: {
              id: true,
              name: true,
              shop: {
                id: true,
              },
              detail: true,
              amount: true,
              quantity: true,
              sold: true,
              star: true,
              status: true,
            },
            where: {
              category: {
                id: In(categoryIds),
              },
              star: Between(star.min, star.max),
              status: In([ProductEnum.AVAILABLE, ProductEnum.OUT_OF_ORDER]),
            },
            order: {
              star: 'DESC',
              sold: 'DESC',
              amount: 'ASC',
            },
            take: take,
            skip: skip,
          });
        }
      } else {
        if (price !== null) {
          product = await productRepository.find({
            relations: {
              shop: true,
              category: true,
              productImage: {
                localFile: true,
              },
            },
            select: {
              id: true,
              name: true,
              shop: {
                id: true,
              },
              detail: true,
              amount: true,
              quantity: true,
              sold: true,
              star: true,
              status: true,
            },
            where: {
              category: {
                id: In(categoryIds),
              },
              amount: Between(price.min, price.max),
              status: In([ProductEnum.AVAILABLE, ProductEnum.OUT_OF_ORDER]),
            },
            order: {
              star: 'DESC',
              sold: 'DESC',
              amount: price.orderBy,
            },
            take: take,
            skip: skip,
          });
        } else {
          product = await productRepository.find({
            relations: {
              shop: true,
              category: true,
              productImage: {
                localFile: true,
              },
            },
            select: {
              id: true,
              name: true,
              shop: {
                id: true,
              },
              detail: true,
              amount: true,
              quantity: true,
              sold: true,
              star: true,
              status: true,
            },
            where: {
              category: {
                id: In(categoryIds),
              },
              status: In([ProductEnum.AVAILABLE, ProductEnum.OUT_OF_ORDER]),
            },
            order: {
              star: 'DESC',
              sold: 'DESC',
              amount: 'ASC',
            },
            take: take,
            skip: skip,
          });
        }
      }
    } else {
      if (star !== null) {
        if (price !== null) {
          product = await productRepository.find({
            relations: {
              shop: true,
              category: true,
              productImage: {
                localFile: true,
              },
            },
            select: {
              id: true,
              name: true,
              shop: {
                id: true,
              },
              detail: true,
              amount: true,
              quantity: true,
              sold: true,
              star: true,
              status: true,
            },
            where: {
              star: Between(star.min, star.max),
              amount: Between(price.min, price.max),
              status: In([ProductEnum.AVAILABLE, ProductEnum.OUT_OF_ORDER]),
            },
            order: {
              star: 'DESC',
              sold: 'DESC',
              amount: price.orderBy,
            },
            take: take,
            skip: skip,
          });
        } else {
          product = await productRepository.find({
            relations: {
              shop: true,
              category: true,
              productImage: {
                localFile: true,
              },
            },
            select: {
              id: true,
              name: true,
              shop: {
                id: true,
              },
              detail: true,
              amount: true,
              quantity: true,
              sold: true,
              star: true,
              status: true,
            },
            where: {
              star: Between(star.min, star.max),
              status: In([ProductEnum.AVAILABLE, ProductEnum.OUT_OF_ORDER]),
            },
            order: {
              star: 'DESC',
              sold: 'DESC',
              amount: 'ASC',
            },
            take: take,
            skip: skip,
          });
        }
      } else {
        if (price !== null) {
          product = await productRepository.find({
            relations: {
              shop: true,
              category: true,
              productImage: {
                localFile: true,
              },
            },
            select: {
              id: true,
              name: true,
              shop: {
                id: true,
              },
              detail: true,
              amount: true,
              quantity: true,
              sold: true,
              star: true,
              status: true,
            },
            where: {
              amount: Between(price.min, price.max),
              status: In([ProductEnum.AVAILABLE, ProductEnum.OUT_OF_ORDER]),
            },
            order: {
              star: 'DESC',
              sold: 'DESC',
              amount: price.orderBy,
            },
            take: take,
            skip: skip,
          });
        } else {
          product = await productRepository.find({
            relations: {
              shop: true,
              category: true,
              productImage: {
                localFile: true,
              },
            },
            select: {
              id: true,
              name: true,
              shop: {
                id: true,
              },
              detail: true,
              amount: true,
              quantity: true,
              sold: true,
              star: true,
              status: true,
            },
            where: {
              status: In([ProductEnum.AVAILABLE, ProductEnum.OUT_OF_ORDER]),
            },
            order: {
              star: 'DESC',
              sold: 'DESC',
              amount: 'ASC',
            },
            take: take,
            skip: skip,
          });
        }
      }
    }
    return product;
  }

  @ModelService()
  static async postNew(
    transactionalEntityManager: EntityManager,
    shop: Shop,
    name: string,
    categoryId: number,
    detail: string,
    amount: number,
    quantity: number,
    status: ProductEnum,
    localFiles: LocalFile[]
  ): Promise<Response> {
    const category = await transactionalEntityManager
      .getRepository(Category)
      .findOne({
        where: {
          id: categoryId,
        },
      });
    if (category == null) {
      return new Response(HttpStatusCode.BAD_REQUEST, 'Category not exist.');
    } else {
      let product = new Product();
      var productImages = new Array<ProductImage>();
      var productImage;
      product.shop = shop;
      product.name = name;
      product.category = category;
      product.detail = detail;
      product.amount = amount;
      product.quantity = quantity;
      product.status = status;

      const productEntity = await transactionalEntityManager
        .getRepository(Product)
        .save(product);

      localFiles.forEach(localFile => {
        productImage = new ProductImage();
        productImage.localFile = localFile;
        productImage.product = productEntity;
        productImages.push(productImage);
      });

      await transactionalEntityManager
        .getRepository(ProductImage)
        .save(productImages);
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
      { status: ProductEnum.DELETED, deletedAt: new Date() }
    );
    if (result.affected == 1) {
      return new Response(HttpStatusCode.OK, 'Delete product successfully!');
    } else {
      return new Response(HttpStatusCode.BAD_REQUEST, 'Delete product failed!');
    }
  }
}

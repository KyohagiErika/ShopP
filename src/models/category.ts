import { ShopPDataSource } from '../data';
import { Product } from '../entities/product';
import { HttpStatusCode } from '../utils/shopp.enum';
import Response from '../utils/response';
import { Category } from '../entities/category';

const categoryRepository = ShopPDataSource.getRepository(Category);

export default class CategoryModel {
  static async listAll() {
    const category = await categoryRepository.find({
      select: {
        id: true,
        name: true,
      },
    });
    return category && category.length > 0 ? category : false;
  }

  static async getOneById(id: number) {
    const category = await categoryRepository.find({
      select: {
        id: true,
        name: true,
      },
      where: {
        id: id,
      },
    });
    return category ? category : false;
  }

  static async postNew(name: string) {
    const category = await categoryRepository.findOne({
      select: {
        id: true,
        name: true,
      },
      where: {
        name: name,
      },
    });

    if (!(category == null)) {
      return new Response(
        HttpStatusCode.BAD_REQUEST,
        'Category already exist !',
        category
      );
    } else {
      let newCategory = new Category();
      newCategory.name = name;
      await categoryRepository.save(newCategory);

      return new Response(
        HttpStatusCode.CREATED,
        'Create new category successfully!',
        newCategory
      );
    }
  }
}

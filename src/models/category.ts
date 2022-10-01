import { ShopPDataSource } from '../data';
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

  static async postNew(name: string, description: string) {
    let category = new Category();
    category.name = name;
    await categoryRepository.save(category);

    return new Response(
      HttpStatusCode.CREATED,
      'Create new category successfully!',
      category
    );
  }
}

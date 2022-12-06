import { ShopPDataSource } from '../data';
import { HttpStatusCode } from '../utils/shopp.enum';
import Response from '../utils/response';
import { Category } from '../entities/category';
import { LocalFile } from '../entities/localFile';

const categoryRepository = ShopPDataSource.getRepository(Category);

export default class CategoryModel {
  static async listAll() {
    const category = await categoryRepository.find({
      relations: {
        image: true,
      },
      select: {
        id: true,
        name: true,
      },
    });
    return category && category.length > 0 ? category : false;
  }

  static async getOneById(id: number) {
    const category = await categoryRepository.findOne({
      relations: {
        image: true,
      },
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

  static async postNew(name: string, image: LocalFile) {
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
      newCategory.image = image;
      await categoryRepository.save(newCategory);

      return new Response(
        HttpStatusCode.CREATED,
        'Create new category successfully!',
        newCategory
      );
    }
  }
}

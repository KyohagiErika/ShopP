import { Request, Response } from 'express';
import { LocalFile } from '../entities/localFile';
import CategoryModel from '../models/category';
import UploadModel from '../models/upload';
import { ControllerService } from '../utils/decorators';
import { HttpStatusCode } from '../utils/shopp.enum';

export default class CategoryMiddleware {
  @ControllerService()
  static async listAll(req: Request, res: Response) {
    const result = await CategoryModel.listAll();
    res.status(HttpStatusCode.OK).send({ data: result });
  }

  @ControllerService()
  static async getOneById(req: Request, res: Response) {
    const id = +req.params.id;
    const result = await CategoryModel.getOneById(id);
    if (result) {
      res.status(HttpStatusCode.OK).send({ data: result });
    } else {
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ message: 'Get Category failed!' });
    }
  }

  /**
   * @swagger
   * components:
   *  schemas:
   *   CategoryRequest:
   *    type: object
   *    properties:
   *     name:
   *      type: string
   *      description: name of category
   *      example: 'Ao Quan'
   *     image:
   *      type: string
   *      format: binary
   *      description: image of category
   */
  @ControllerService({
    body: [
      {
        name: 'name',
        type: String,
      },
    ],
  })
  static async postNew(req: Request, res: Response) {
    if (req.file != undefined) {
      const file: Express.Multer.File = req.file;
      const localFile: LocalFile = await UploadModel.upload(file);

      const data = req.body;
      const result = await CategoryModel.postNew(data.name, localFile);
      if (result.getCode() === HttpStatusCode.CREATED) {
        res
          .status(result.getCode())
          .send({ message: result.getMessage(), data: result.getData() });
      } else {
        res.status(result.getCode()).send({ message: result.getMessage() });
      }
    } else
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ error: 'Please upload category image' });
  }
}

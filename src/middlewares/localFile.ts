import { Request, Response } from 'express';
import { ControllerService } from '../utils/decorators';
import { HttpStatusCode } from '../utils/shopp.enum';
import UploadModel from '../models/upload';

export default class LocalFileMiddleware {
  @ControllerService()
  static async postImage(req: Request, res: Response) {
    if (req.file != undefined) {
      const file = req.file;
      await UploadModel.upload(file);
      res
        .status(HttpStatusCode.OK)
        .send({ message: 'Image uploaded successfully' });
    } else
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ error: 'Please upload image' });
  }

  @ControllerService()
  static async postMultipleImage(req: Request, res: Response) {
    const files = req.files;
    if (files == undefined) {
      return res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ error: 'Please choose images' });
    }
    await UploadModel.uploadMultiple(files);
    return res
      .status(HttpStatusCode.OK)
      .send({ message: 'Images uploaded Successfully' });
  }

  @ControllerService()
  static async postVideo(req: Request, res: Response) {
    if (req.file != undefined) {
      const file = req.file;
      await UploadModel.upload(file);
      res
        .status(HttpStatusCode.OK)
        .send({ message: 'Video uploaded successfully' });
    } else
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ error: 'Please upload video' });
  }
}

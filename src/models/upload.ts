import { Request, Response } from 'express';
import { ShopPDataSource } from '../data';
import { LocalFile } from '../entities/localFile';
import path from 'path';

const localFileRepository = ShopPDataSource.getRepository(LocalFile);

export default class UploadModel {
  static async getImage(req: Request, res: Response) {
    const fileName = req.params.name;
    const directoryPath =
      path.dirname(path.dirname(__dirname)) + '/public/uploads/';
    res.sendFile(path.join(directoryPath, fileName));
  }
  static async upload(file: Express.Multer.File) {
    let localFile: LocalFile = new LocalFile();
    localFile.filename = file.filename;
    localFile.mimetype = file.mimetype;
    localFile.path = file.path;

    await localFileRepository.save(localFile);
    return localFile;
  }

  static async uploadMultiple(
    files:
      | Express.Multer.File[]
      | { [fieldname: string]: Express.Multer.File[] }
  ): Promise<LocalFile[]> {
    let localFile: LocalFile;
    let localFiles = new Array<LocalFile>();

    (files as Array<Express.Multer.File>).map(file => {
      localFile = new LocalFile();
      localFile.filename = file.filename;
      localFile.mimetype = file.mimetype;
      localFile.path = file.path;
      localFiles.push(localFile);
    });
    await localFileRepository.save(localFiles);
    return localFiles;
  }
}

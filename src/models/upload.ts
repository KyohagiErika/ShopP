import { ShopPDataSource } from '../data';
import { LocalFile } from '../entities/localFile';

const localFileRepository = ShopPDataSource.getRepository(LocalFile);

export default class UploadModel {
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
  ) {
    let localFile: LocalFile;

    (files as Array<Express.Multer.File>).map(async file => {
      localFile = new LocalFile();
      localFile.filename = file.filename;
      localFile.mimetype = file.mimetype;
      localFile.path = file.path;

      await localFileRepository.save(localFile);
    });
  }
}

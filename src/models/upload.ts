import { ShopPDataSource } from '../data';
import { LocalFile } from '../entities/localFile';
import { HttpStatusCode } from '../utils/shopp.enum';

export default class AuthModel {
  static async upload(file: Express.Multer.File) {
    let localFile: LocalFile = new LocalFile();
    localFile.filename = file.filename;
    localFile.mimetype = file.mimetype;
    localFile.path = file.path;

    const localFileRepository = ShopPDataSource.getRepository(LocalFile);
    await localFileRepository.save(localFile);
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

      const localFileRepository = ShopPDataSource.getRepository(LocalFile);
      await localFileRepository.save(localFile);
    });
  }
}

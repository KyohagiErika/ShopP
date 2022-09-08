import path from 'path';
import { Router, Request, Response } from 'express';
import { uploadImage, uploadVideo } from '../middlewares/fileProvider';
import UploadMiddleware from '../middlewares/upload';

const routes = Router();
routes.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

routes.post(
  '/image',
  uploadImage.single('image'),
  UploadMiddleware.uploadImage
);

routes.post(
  '/image-multiple',
  uploadImage.array('images', 10),
  UploadMiddleware.uploadVideo
);

routes.post(
  '/video',
  uploadVideo.single('video'),
  UploadMiddleware.uploadVideo
);
export default routes;

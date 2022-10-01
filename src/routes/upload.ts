import { Router, Request, Response } from 'express';
import {
  uploadImage,
  uploadVideo,
  uploadMultipleImage,
} from '../middlewares/fileProvider';
import LocalFileMiddleware from '../middlewares/localFile';

const routes = Router();

routes.post('/image', uploadImage, LocalFileMiddleware.postImage);

routes.post(
  '/image-multiple',
  uploadMultipleImage,
  LocalFileMiddleware.postMultipleImage
);

routes.post('/video', uploadVideo, LocalFileMiddleware.postVideo);
export default routes;

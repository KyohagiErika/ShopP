import { validate } from "class-validator";
import { Router, Request, Response, NextFunction } from "express";
import { ShopPDataSource } from "../data";
import { LocalFile } from "../entities/localFile";
import { uploadFile } from "../middlewares/upload";

const routes = Router();

routes.post("/upload", uploadFile.single('image'), async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).send({ message: "Please upload file" });
        }
        const file = req.file;
        let localFile: LocalFile = new LocalFile();
        localFile.filename = file.filename;
        localFile.mimetype = file.mimetype;
        localFile.path = file.path;

        const errors = await validate(localFile);
        if (errors.length > 0) {res.status(400).send({ "errors": errors });}

        const localFileRepository = ShopPDataSource.getRepository(LocalFile);
        try {
            await localFileRepository.save(localFile);
        } catch (e) {
            return res.status(400).send({ "e": e });
        }
        return res.status(200).send({ message: 'File uploaded Successfully' });
    } catch (err) {
        return res.status(400).send({ message: "Upload file failed!" });
    }
})

routes.post('/upload-multiple', uploadFile.array('images', 10), (req: Request, res: Response, next: NextFunction) => {
    const files = req.files;
    //insert files into database

    if (!files) {
        const error = new Error('Please choose files');
        return next(error);
    }
    res.status(200).send(files);
})
export default routes;
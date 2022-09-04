import { validate } from "class-validator";
import path from "path"
import { Router, Request, Response } from "express";
import { ShopPDataSource } from "../data";
import { LocalFile } from "../entities/localFile";
import { uploadImage, uploadVideo } from "../middlewares/upload";

const routes = Router();
routes.get("/", (req: Request, res: Response) => {
    res.sendFile( path.join(__dirname, '../index.html'));
})

routes.post("/image", uploadImage.single('image'), async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).send({ message: "Please upload image" });
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
        return res.status(200).send({ message: 'Image uploaded successfully' });
    } catch (err) {
        return res.status(400).send({ message: "Upload image failed!" });
    }
})

routes.post('/image-multiple', uploadImage.array('images', 10), (req: Request, res: Response) => {
    const files = req.files;
    //insert files into database

    if (!files || files == undefined) {
        const error = new Error('Please choose images');
        return res.status(400).send({"error": error})
    }
    const localFileRepository = ShopPDataSource.getRepository(LocalFile);
    let localFile: LocalFile;
    
    (files as Array<Express.Multer.File>).map(async file => {
        localFile = new LocalFile();
        localFile.filename = file.filename;
        localFile.mimetype = file.mimetype;
        localFile.path = file.path;

        let errors = await validate(localFile);
        if (errors.length > 0) {return res.status(400).send({ "errors": errors });}
        
        try {
            await localFileRepository.save(localFile);
        } catch (e) {
            return res.status(400).send({ "e": e });
        }
        return
    })  
    return res.status(200).send({ message: 'Images uploaded Successfully' });
})

routes.post('/video', uploadVideo.single('video'), async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).send({ message: "Please upload video" });
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
        return res.status(200).send({ message: 'Video uploaded Successfully' });
    } catch (err) {
        return res.status(400).send({ message: "Upload video failed!" });
    }
})
export default routes;
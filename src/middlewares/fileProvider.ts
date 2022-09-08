import  fs  from "fs";
import multer from "multer";
import { Request} from "express";
import ShopPConfig from "../utils/shopp.config";
import path from "path";

const fileStorage = multer.diskStorage({
    destination : function (req: Request, file: any, callback: any) {
        if(!fs.existsSync(path.join(path.dirname(path.dirname(__dirname)),ShopPConfig.IMAGE_PATH))) {
            fs.mkdirSync(path.join(path.dirname(path.dirname(__dirname)),ShopPConfig.IMAGE_PATH), {recursive:true});
        }
        callback(null, ShopPConfig.IMAGE_PATH);
    },
    filename: function (req: Request, file: any, callback: any) {
        const fileInfo = file.mimetype.split('/');
        const fileName = `${fileInfo[0]}-${file.fieldname}-${Date.now()}.${fileInfo[1]}`
        callback(null, fileName);
    }
})

const imageFilter = (req: Request, file: any, callback: any) => {
    if (!file.originalname.match(/\.(JPG|jpg|jpeg|png|gif)$/)) {
        return callback(new Error('Only image files are allowed!'), false);
    }
    callback(null, true);
};

const videoFilter = (req: Request, file: any, callback: any) => {
    if (!file.originalname.match(/\.(mp4|ogg|wmv|webm|avi)$/)) {
        return callback(new Error('Only video files are allowed!'), false);
    }
    callback(null, true);
};

export const uploadImage = multer({ fileFilter: imageFilter, storage: fileStorage})
export const uploadVideo = multer({ fileFilter: videoFilter, storage: fileStorage})
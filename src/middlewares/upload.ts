import  fs  from "fs";
import multer from "multer";
import { Request} from "express";
import ShopPConfig from "../utils/shopp.config";

const fileStorage = multer.diskStorage({
    destination : function (req: Request, file: any, callback: any) {
        if(!fs.existsSync(__dirname+'/../../'+ShopPConfig.IMAGE_PATH)) {
            fs.mkdirSync(__dirname+'/../../'+ShopPConfig.IMAGE_PATH, {recursive:true});
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

export const uploadFile = multer({ fileFilter: imageFilter, storage: fileStorage})

import { UserOtp } from '../entities/userOtp';
import AuthModel from '../models/auth';
import { HttpStatusCode, OtpEnum } from './shopp.enum';
import path from 'path';
import fs from 'fs';
import ShopPConfig from './shopp.config';

//GENERATE OTP
const generateOtp = (len: number): string => {
  const digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < len; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
};

//Delete file in public/uploads
const deleteFile = (pathFile: string) => {
  pathFile = pathFile.replace('//','/');
  if (
    fs.existsSync(
      path.join(path.dirname(path.dirname(__dirname)), pathFile)
    )
  ) {
    fs.unlinkSync(
      path.join(
        path.dirname(path.dirname(__dirname)),
        pathFile
      )
    );
  }
};

export { generateOtp, deleteFile };

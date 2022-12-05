import path from 'path';
import fs from 'fs';
import { OrderRequest } from '../interfaces/order';
import { OrderProductRequest } from '../interfaces/orderProduct';

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
  pathFile = pathFile.replace('//', '/');
  if (
    fs.existsSync(path.join(path.dirname(path.dirname(__dirname)), pathFile))
  ) {
    fs.unlinkSync(path.join(path.dirname(path.dirname(__dirname)), pathFile));
  }
};

//Check valid type
const instanceOfOrderRequest = (data: OrderRequest) => {
  return (
    'estimateDeliveryTime' in data &&
    'totalBill' in data &&
    'transportFee' in data &&
    'shoppingUnitId' in data &&
    'voucherIds' in data &&
    'shopId' in data &&
    'orderProducts' in data &&
    data.orderProducts.every(instanceOfOrderProductRequest)
  );
};

const instanceOfOrderProductRequest = (data: OrderProductRequest) => {
  return (
    'price' in data &&
    'additionalInfo' in data &&
    'quantity' in data &&
    'productId' in data
  );
};

const enumToArray = (enumType: any) => {
  return Object.keys(enumType).map(key => ({
    name: key,
    description: enumType[key],
  }));
};

export { generateOtp, deleteFile, instanceOfOrderRequest, enumToArray };

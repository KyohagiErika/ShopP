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
    'transportFee' in data &&
    'shoppingUnitId' in data &&
    'shopVoucherId' in data &&
    'shopId' in data &&
    'orderProducts' in data &&
    Number.isInteger(data.transportFee) &&
    Number.isInteger(data.shoppingUnitId) &&
    data.orderProducts.every(instanceOfOrderProductRequest)
  );
};

const instanceOfOrderProductRequest = (data: OrderProductRequest) => {
  return (
    'quantity' in data &&
    'additionalInfo' in data &&
    'productId' in data &&
    Number.isInteger(data.quantity)
  );
};

const instanceOfPriceProductFilterRequest = (data: any) => {
  return (
    'min' in data &&
    'max' in data &&
    'orderBy' in data &&
    Number.isInteger(data.min) &&
    Number.isInteger(data.max) &&
    (data.orderBy === 'ASC' || data.orderBy === 'DESC') &&
    data.min >= 0 &&
    data.max >= 0 &&
    data.min <= data.max
  );
};

const instanceOfStarProductFilterRequest = (data: any) => {
  return (
    'min' in data &&
    'max' in data &&
    Number.isInteger(data.min) &&
    Number.isInteger(data.max) &&
    data.min >= 0 &&
    data.max <= 5 &&
    data.min <= data.max
  );
};

const enumToArray = (enumType: any) => {
  const keys = Object.keys(enumType).filter(key => !Number.isInteger(+key));
  return keys.map(key => ({
    name: key,
    description: enumType[key],
  }));
};

const enumObject = (enumType: any) => {
  const keys = Object.keys(enumType).filter(key => !Number.isInteger(+key));
  return keys;
};

const getValueByKeyEnum = (enumType: any, value: string) => {
  return Object.entries(enumType).find(
    ([key, val]) => key === value
  )?.[1] as number;
};

export {
  generateOtp,
  deleteFile,
  instanceOfOrderRequest,
  enumToArray,
  instanceOfPriceProductFilterRequest,
  instanceOfStarProductFilterRequest,
  enumObject,
  getValueByKeyEnum,
};

import { VoucherTypeEnum } from '../utils/shopp.enum';

export interface VoucherCustomerResponse {
  id: string;
  title: string;
  type: VoucherTypeEnum;
  minBillPrice: number;
  priceDiscount: number;
  maxPriceDiscount: number;
  mfgDate: Date;
  expDate: Date;
}

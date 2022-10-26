import { VoucherTypeEnum } from "../utils/shopp.enum"

export interface VoucherCustomerResponse {
  id: string,
  title: string,
  type: VoucherTypeEnum,
  condition: string,
  mfgDate: Date,
  expDate: Date
}


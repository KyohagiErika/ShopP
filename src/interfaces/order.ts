import { OrderProductRequest } from './orderProduct';

export interface OrderRequest {
  estimateDeliveryTime: string;
  transportFee: number;
  shoppingUnitId: number;
  voucherIds: string[];
  shopId: string;
  orderProducts: OrderProductRequest[];
}

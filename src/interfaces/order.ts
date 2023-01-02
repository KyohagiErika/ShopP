import { OrderProductRequest } from './orderProduct';

export interface OrderRequest {
  estimateDeliveryTime: string;
  transportFee: number;
  shoppingUnitId: number;
  shopVoucherId: string;
  shopId: string;
  orderProducts: OrderProductRequest[];
}

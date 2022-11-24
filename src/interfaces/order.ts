import { OrderProductRequest } from "./orderProduct";

export interface OrderRequest {
    estimateDeliveryTime: string,
    totalBill: number,
    transportFee: number,
    shoppingUnitId: number,
    voucherId: string,
    shopId: string,
    orderProducts: OrderProductRequest[]
}

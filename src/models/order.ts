import { should } from "chai";
import { ShopPDataSource } from "../data";
import { Customer } from "../entities/customer";
import { Order } from "../entities/order";
import { Payment } from "../entities/payment";
import { Shop } from "../entities/shop";
import { ShoppingUnit } from "../entities/shoppingUnit";
import { Voucher } from "../entities/voucher";
import Response from "../utils/response";
import { DeliveryStatusEnum, HttpStatusCode, StatusEnum } from "../utils/shopp.enum";

const orderReposity = ShopPDataSource.getRepository(Order)
const shopReposity = ShopPDataSource.getRepository(Shop)
const paymentReposity = ShopPDataSource.getRepository(Payment)
const shoppingUnitReposity = ShopPDataSource.getRepository(ShoppingUnit)
const voucherReposity = ShopPDataSource.getRepository(Voucher)
const customerReposity = ShopPDataSource.getRepository(Customer)
export default class orderModel {
    static async viewOrderForCustomer(customer: Customer) {
        const order = await orderReposity.find({
            relations: {
                payment: true,
                shoppingUnit: true,
                voucher: true,
                shop: true,
                customer: true
            },
            select: {
                id: true,
                createdAt: true,
                deliveryStatus: true,
                address: true,
                shop: {
                    name: true
                },
                customer: {
                    name: true
                },
                payment: {
                    name: true
                },
                estimateDeliveryTime: true,
                shoppingUnit: {
                    name: true
                },
                totalBill: true,
                transportFee: true,
                voucher: {
                    title: true
                },
                totalPayment: true,
                status: true
            },
            where: [
                {
                    customer: { id: customer.id },
                    status: StatusEnum.ACTIVE,
                    deliveryStatus: DeliveryStatusEnum.CHECKING
                },
                {
                    customer: { id: customer.id },
                    status: StatusEnum.ACTIVE,
                    deliveryStatus: DeliveryStatusEnum.CONFIRMED
                },
                {
                    customer: { id: customer.id },
                    status: StatusEnum.ACTIVE,
                    deliveryStatus: DeliveryStatusEnum.PACKAGING
                },
            ]
        });
        return order ? order : false
    }

    static async viewOrderForShop(shop: Shop) {
        const order = await orderReposity.find({
            relations: {
                payment: true,
                shoppingUnit: true,
                voucher: true,
                shop: true,
                customer: true
            },
            select: {
                id: true,
                createdAt: true,
                deliveryStatus: true,
                address: true,
                shop: {
                    name: true
                },
                customer: {
                    name: true
                },
                payment: {
                    name: true
                },
                estimateDeliveryTime: true,
                shoppingUnit: {
                    name: true
                },
                totalBill: true,
                transportFee: true,
                voucher: {
                    title: true
                },
                totalPayment: true,
                status: true
            },
            where: [
                {
                    shop: { id: shop.id },
                    status: StatusEnum.ACTIVE,
                    deliveryStatus: DeliveryStatusEnum.CHECKING
                }
            ]
        });
        return order ? order : false
    }

    static async viewOrderDeliver() {
        const order = await orderReposity.find({
            relations: {
                payment: true,
                shoppingUnit: true,
                voucher: true,
                shop: true,
                customer: true
            },
            select: {
                id: true,
                createdAt: true,
                deliveryStatus: true,
                address: true,
                shop: {
                    name: true
                },
                customer: {
                    name: true
                },
                payment: {
                    name: true
                },
                estimateDeliveryTime: true,
                shoppingUnit: {
                    name: true
                },
                totalBill: true,
                transportFee: true,
                voucher: {
                    title: true
                },
                totalPayment: true,
                status: true
            },
            where: {
                status: StatusEnum.ACTIVE,
                deliveryStatus: DeliveryStatusEnum.DELIVERING
            }
        });
        return order ? order : false
    }

    static async viewHistory() {
        const order = await orderReposity.find({
            relations: {
                payment: true,
                shoppingUnit: true,
                voucher: true,
                shop: true,
                customer: true
            },
            select: {
                id: true,
                createdAt: true,
                deliveryStatus: true,
                address: true,
                shop: {
                    name: true
                },
                customer: {
                    name: true
                },
                payment: {
                    name: true
                },
                estimateDeliveryTime: true,
                shoppingUnit: {
                    name: true
                },
                totalBill: true,
                transportFee: true,
                voucher: {
                    title: true
                },
                totalPayment: true,
                status: true
            },
            where: {
                status: StatusEnum.INACTIVE,
                deliveryStatus: DeliveryStatusEnum.DELIVERED
            }
        });
        return order ? order : false
    }

    static async viewCancerOrder() {
        const order = await orderReposity.find({
            relations: {
                payment: true,
                shoppingUnit: true,
                voucher: true,
                shop: true,
                customer: true
            },
            select: {
                id: true,
                createdAt: true,
                deliveryStatus: true,
                address: true,
                shop: {
                    name: true
                },
                customer: {
                    name: true
                },
                payment: {
                    name: true
                },
                estimateDeliveryTime: true,
                shoppingUnit: {
                    name: true
                },
                totalBill: true,
                transportFee: true,
                voucher: {
                    title: true
                },
                totalPayment: true,
                status: true
            },
            where: {
                status: StatusEnum.INACTIVE,
                deliveryStatus: DeliveryStatusEnum.DELIVERED
            }
        });
        return order ? order : false
    }

    static async postNew(
        deliveryStatus: DeliveryStatusEnum,
        address: string,
        estimateDeliveryTime: string,
        totalBill: number,
        transportFee: number,
        totalPayment: number,
        status: StatusEnum,
        paymentId: number,
        shoppingUnitId: number,
        voucherId: string,
        shopId: string,
        customer: Customer
    ) {
        const shop = await shopReposity.findOne({
            where: {
                id: shopId
            }
        });
        if (shop == null) {
            return new Response(HttpStatusCode.BAD_REQUEST, 'shop not exist.');
        }

        const payment = await paymentReposity.findOne({
            where: {
                id: paymentId
            }
        });
        if (payment == null) {
            return new Response(HttpStatusCode.BAD_REQUEST, 'payment not exist.');
        }

        const shoppingUnit = await shoppingUnitReposity.findOne({
            where: {
                id: shoppingUnitId
            }
        });
        if (shoppingUnit == null) {
            return new Response(HttpStatusCode.BAD_REQUEST, 'shopping unit not exist.');
        }
        const voucher = await voucherReposity.find({
            where: {
                id: voucherId
            }
        });
        if (voucher == null) {
            return new Response(HttpStatusCode.BAD_REQUEST, 'voucher not exist.');
        } else {
            let order = new Order();
            order.deliveryStatus = deliveryStatus,
                order.address = address,
                order.estimateDeliveryTime = estimateDeliveryTime,
                order.status = status,
                order.totalBill = totalBill,
                order.transportFee = transportFee,
                order.totalPayment = totalPayment,
                order.payment = payment,
                order.shoppingUnit = shoppingUnit,
                order.voucher = voucher,
                order.shop = shop,
                order.customer = customer
            await orderReposity.save(order);
            return new Response(
                HttpStatusCode.CREATED,
                'Create new order successfully!',
                order
            );
        }
    }

    static async editDeliveryStatus(id: string, deliveryStatus: DeliveryStatusEnum) {
        if (deliveryStatus == DeliveryStatusEnum.DELIVERED) {
            const order = await orderReposity.update(
                { id: id },
                { deliveryStatus: deliveryStatus, status: StatusEnum.INACTIVE }
            );
            if (order.affected == 1) {
                return new Response(HttpStatusCode.OK, 'Done!');
            } else {
                return new Response(HttpStatusCode.BAD_REQUEST, 'Not Done!');
            }
        } else {
            const order = await orderReposity.update(
                { id: id },
                { deliveryStatus: deliveryStatus, status: StatusEnum.ACTIVE }
            );
            if (order.affected == 1) {
                return new Response(HttpStatusCode.OK, 'Done!');
            } else {
                return new Response(HttpStatusCode.BAD_REQUEST, 'Not Done!');
            }
        }
    }

    static async cancerOrder(id: string) {
        const order = await orderReposity.findOne({
            where: {
                id: id,
            },
        });
        if (order == null) {
            return new Response(HttpStatusCode.BAD_REQUEST, 'Order not exist.');
        }
        if (order.deliveryStatus == DeliveryStatusEnum.PACKAGING || order.deliveryStatus == DeliveryStatusEnum.DELIVERING) {
            return new Response(HttpStatusCode.BAD_REQUEST, 'Order can not cancer')
        }

        const result = await orderReposity.update(
            {
                id: id,
            },

            { deliveryStatus: DeliveryStatusEnum.CANCELLED, status: StatusEnum.INACTIVE }
        );
        if (result.affected == 1) {
            return new Response(HttpStatusCode.OK, 'Cancer order successfully!');
        } else {
            return new Response(HttpStatusCode.BAD_REQUEST, 'Cancer order failed!');
        }
    }
}
import { response } from "express";
import { ShopPDataSource } from "../data";
import { Order } from "../entities/order";
import { TrackingOrder } from "../entities/trackingOrder";
import Response from "../utils/response";
import { DeliveryStatusEnum, HttpStatusCode, TitleStatusEnum } from "../utils/shopp.enum";

const trackingOrderRepository = ShopPDataSource.getRepository(TrackingOrder);
const orderRepository = ShopPDataSource.getRepository(Order);

export default class trackingOrderModel {
    static async trackingOrder(orderId: string) {
        const trackingOrder = await trackingOrderRepository.find({
            where: {
                orderNumber: { id: orderId }
            },
        });
        return trackingOrder && trackingOrder.length > 0 ? trackingOrder : false;
    }

    static async getOneById(id: number) {
        const trackingOrder = await trackingOrderRepository.findOne({
            where: {
                id: id,
            },
        });
        return trackingOrder ? trackingOrder : false;
    }

    static async postNew(
        orderId: string,
        title: number,
        deliveryStatus: number,
        location: string
    ) {
        const order = await orderRepository.findOne({
            where: {
                id: orderId,
            },
        });
        if (order == null) {
            return new Response(HttpStatusCode.BAD_REQUEST, 'Order not exist!')
        }
        if (order != null && deliveryStatus < order.deliveryStatus) {
            return new Response(
                HttpStatusCode.BAD_REQUEST,
                'Cannot change status backward'
            );
        }

        // if (deliveryStatus != 3 && deliveryStatus != 5 && deliveryStatus != 6) {
        //     if (deliveryStatus != title) {
        //         return new Response(
        //             HttpStatusCode.BAD_REQUEST,
        //             'Title is not match delivery status 1'
        //         );
        //     }
        // } 
        if (deliveryStatus == 3) {
            if (title < 3.1 || title > 3.4) {
                return new Response(
                    HttpStatusCode.BAD_REQUEST,
                    'Title is not match delivery status 3'
                );
            }
        } else if (deliveryStatus == 5) {
            if (title < 5.1 || title > 5.2) {
                return new Response(
                    HttpStatusCode.BAD_REQUEST,
                    'Title is not match delivery status 5'
                );
            }
        } else if (deliveryStatus == 6) {
            if (title < 6.1 || title > 6.2) {
                return new Response(
                    HttpStatusCode.BAD_REQUEST,
                    'Title is not match delivery status 6'
                );
            }
        } else {
            if (deliveryStatus != title) {
                return new Response(
                    HttpStatusCode.BAD_REQUEST,
                    'Title is not match delivery status 1'
                );
            }

        }

        const newTrackingOrder = new TrackingOrder()
        newTrackingOrder.orderNumber = order
        newTrackingOrder.title = title
        newTrackingOrder.deliveryStatus = deliveryStatus
        newTrackingOrder.location = location

        await trackingOrderRepository.save(newTrackingOrder)
        return new Response(
            HttpStatusCode.CREATED,
            'Create new tracking order successfully !',
            newTrackingOrder
        );


    }
}
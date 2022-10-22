import { ShopPDataSource } from "../data";
import { OrderProduct } from "../entities/oderProduct";
import { Order } from "../entities/order";
import { Product } from "../entities/product";
import Response from "../utils/response";
import { HttpStatusCode } from "../utils/shopp.enum";

const orderProductRepository = ShopPDataSource.getRepository(OrderProduct)
const orderReposity = ShopPDataSource.getRepository(Order)
const productRepository = ShopPDataSource.getRepository(Product)
export default class orderProductModel {
    static async viewOrderProduct(orderNumber: string) {
        const order = await orderProductRepository.find({
            relations: {
                product: true,
                orderNumber: true
            },
            select: {
                id: true,
                price: true,
                quantity: true,
                product: {
                    name: true
                },
                orderNumber: {
                    id: true
                },
                additionalInfo: true,
            },
            where: {
                orderNumber: { id: orderNumber }
            }
        });
        return order ? order : false
    }

    static async postNew(
        price: number,
        quantity: number,
        additionalInfo: string,
        productId: string,
        orderNumber: string
    ) {
        const product = await productRepository.findOne({
            where: {
                id: productId,
            },
        });
        if (product == null) {
            return new Response(
                HttpStatusCode.BAD_REQUEST,
                'product is not exist !'
            );
        }
        if (quantity > product.quantity || quantity < 1)
            return new Response(HttpStatusCode.BAD_REQUEST, 'quantity must be greater than 0 and less than product quantity')

        const order = await orderReposity.findOne({
            where: {
                id: orderNumber,
            },
        });
        if (order == null) {
            return new Response(
                HttpStatusCode.BAD_REQUEST,
                'Order number is not exist !'
            );
        }
        let newOrderProduct = new OrderProduct();
        (newOrderProduct.price = price),
            (newOrderProduct.additionalInfo = additionalInfo),
            (newOrderProduct.quantity = quantity),
            (newOrderProduct.product = product),
            (newOrderProduct.orderNumber = order),
            await orderProductRepository.save(newOrderProduct);
        return new Response(
            HttpStatusCode.CREATED,
            'Create new order successfully!',
            newOrderProduct
        );
    }
}
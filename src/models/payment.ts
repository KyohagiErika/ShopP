import { ShopPDataSource } from "../data";
import { Payment } from "../entities/payment";
import Response from "../utils/response";
import { HttpStatusCode } from "../utils/shopp.enum";

const PaymentRepository = ShopPDataSource.getRepository(Payment);

export default class PaymentModel {
    static async listAll() {
        const payment = await PaymentRepository.find({
            select: {
                id: true,
                name: true,
            },
        });
        return payment && payment.length > 0 ? payment : false;
    }

    static async getOneById(id: number) {
        const payment = await PaymentRepository.find({
            select: {
                id: true,
                name: true,
            },
            where: {
                id: id,
            },
        });
        return payment ? payment : false;
    }

    static async postNew(name: string) {
        const payment = await PaymentRepository.findOne({
            select: {
                id: true,
                name: true,
            },
            where: {
                name: name,
            },
        });

        if (!(payment == null)) {
            return new Response(
                HttpStatusCode.BAD_REQUEST,
                'Payment already exist !',
                payment
            );
        } else {
            let newPayment = new Payment();
            newPayment.name = name;
            await PaymentRepository.save(newPayment);

            return new Response(
                HttpStatusCode.CREATED,
                'Create new payment successfully!',
                newPayment
            );
        }
    }


}
import { Request, Response } from "express";
import { Customer } from "../entities/customer";
import { Shop } from "../entities/shop";
import ReportModel from "../models/report";
import { ControllerService } from "../utils/decorators";
import { HttpStatusCode, StatusReportEnum, TypeTransferEnum } from "../utils/shopp.enum";

export default class ReportMiddleware{
    @ControllerService()
    static async listAll(req: Request, res: Response){
            const result = await ReportModel.listAll();
            if(result){
                res.status(HttpStatusCode.OK).send({data: result});
            }else{
                res.status(HttpStatusCode.BAD_REQUEST).send({message: 'Get report fail !'});
            }
    };

    @ControllerService({
       params: [ 
       { 
        name: 'id',
        type: String
       }
       ]
    })
    static async getOneById(req: Request, res: Response){
        const id = +req.params.id;
        const result = await ReportModel.getOneById(id);
        if(result){
            res.status(HttpStatusCode.OK).send({data: result});
        }else{
            res.status(HttpStatusCode.BAD_REQUEST).send({message: 'Get report fail !'});
        }
    };

    @ControllerService()
    static async viewReport(req: Request, res: Response){
        const id = +req.params.id;
        const result =  await ReportModel.viewReport(id);
        if(result){
            res.status(HttpStatusCode.OK).send({data: result})
        }else{
            res.status(HttpStatusCode.BAD_REQUEST).send({message: 'Get report fail !'})
        }
    }

    @ControllerService({
        params: [
            {
                name: 'shopId',
                type: String
            }
        ],
        body: [
            {
                name: 'reason',
                type: String
            },
            {
                name: 'description',
                type: String
            }
        ]

    })
    static async postNewForCustomer(req: Request, res: Response){
        const customer: Customer = res.locals.user.customer
        const shopId = req.params.shopId
        const data = req.body
        if(customer == null){
            res.status(HttpStatusCode.BAD_REQUEST).send({message: 'Can not find customer !'})
        }
        const result = await ReportModel.postNewForCustomer(
            shopId,
            customer,
            TypeTransferEnum.CUSTOMER_TO_SHOP,
            data.reason,
            data.description,
            StatusReportEnum.PROCESSING

        );
        if(result.getCode() === HttpStatusCode.CREATED){
            res.status(result.getCode()).send({message: result.getMessage(), data: result.getData()})
        }


    }

    @ControllerService({
        params: [
            {
                name: 'CustomerId',
                type: String
            }
        ],
        body: [
            {
                name: 'reason',
                type: String
            },
            {
                name: 'description',
                type: String
            }
        ]

    })
    static async postNewForShop(req: Request, res: Response){
        const customerId = req.params.customerId
        const shop: Shop = res.locals.user.shop
        const data = req.body
        if(shop == null){
            res.status(HttpStatusCode.BAD_REQUEST).send({message: 'Can not find shop !'})
        }
        const result = await ReportModel.postNewForShop(
            shop,
            customerId,
            TypeTransferEnum.CUSTOMER_TO_SHOP,
            data.reason,
            data.description,
            StatusReportEnum.PROCESSING

        );
        if(result.getCode() === HttpStatusCode.CREATED){
            res.status(result.getCode()).send({message: result.getMessage(), data: result.getData()})
        }
    }

    @ControllerService({
        params: [
            {
              name: 'id',
              type: String,
            },
          ]
    })
    static async editStatus(req: Request, res: Response){
        const id = +req.params.id
        const result = await ReportModel.editStatus(id)
        if(result){
            res.status(result.getCode()).send({ message: result.getMessage() });
        }
    }
}
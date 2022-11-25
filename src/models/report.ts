import { ShopPDataSource } from '../data';
import { Customer } from '../entities/customer';
import { Report } from '../entities/report';
import { Shop } from '../entities/shop';
import Response from '../utils/response';
import {
  HttpStatusCode,
  StatusReportEnum,
  TypeTransferEnum,
} from '../utils/shopp.enum';

const reportReposity = ShopPDataSource.getRepository(Report);
const shopReposity = ShopPDataSource.getRepository(Shop);
const customerReposity = ShopPDataSource.getRepository(Customer);

export default class ReportModel {
  static async listAllReportInProcess() {
    const report = await reportReposity.find({
      relations: {
        shop: true,
        customer: true,
      },
      where: {
        status: StatusReportEnum.PROCESSING,
      },
    });
    return report && report.length > 0 ? report : false;
  }

  static async listAllReportProcessed() {
    const report = await reportReposity.find({
      relations: {
        shop: true,
        customer: true,
      },

      where: {
        status: StatusReportEnum.PROCESSED,
      },
    });
    return report ? report : false;
  }

  static async viewReport(id: number) {
    const report = await reportReposity.find({
      relations: {
        shop: true,
        customer: true,
      },

      where: {
        id: id,
      },
    });
    return report ? report : false;
  }

  static async postNewForShop(
    shop: Shop,
    customerId: string,
    type: TypeTransferEnum,
    reason: string,
    description: string,
    status: StatusReportEnum
  ) {
    const customer = await customerReposity.findOne({
      where: {
        id: customerId,
      },
    });
    if (customer == null) {
      return new Response(
        HttpStatusCode.BAD_REQUEST,
        'Customer is not exist !'
      );
    }
    const report = await reportReposity.findOne({
      relations: {
        shop: true,
        customer: true,
      },
      where: {
        shop: { id: shop.id },
        customer: { id: customer.id },
        type: type,
        reason: reason,
        description: description,
        status: StatusReportEnum.PROCESSING,
      },
    });
    if (!(report == null)) {
      return new Response(HttpStatusCode.BAD_REQUEST, 'Report is in process !');
    } else {
      let newReport = new Report();
      (newReport.shop = shop),
        (newReport.customer = customer),
        (newReport.type = type),
        (newReport.reason = reason),
        (newReport.description = description),
        (newReport.status = status),
        await reportReposity.save(newReport);
      return new Response(
        HttpStatusCode.CREATED,
        'Create new report successfully !',
        newReport
      );
    }
  }

  static async postNewForCustomer(
    shopId: string,
    customer: Customer,
    type: TypeTransferEnum,
    reason: string,
    description: string,
    status: StatusReportEnum
  ) {
    const shop = await shopReposity.findOne({
      where: {
        id: shopId,
      },
    });
    if (shop == null) {
      return new Response(HttpStatusCode.BAD_REQUEST, 'Shop is not exist !');
    }
    const report = await reportReposity.findOne({
      relations: {
        shop: true,
        customer: true,
      },
      where: {
        shop: { id: shop.id },
        customer: { id: customer.id },
        type: type,
        reason: reason,
        description: description,
        status: StatusReportEnum.PROCESSING,
      },
    });
    if (!(report == null)) {
      return new Response(HttpStatusCode.BAD_REQUEST, 'Report is in process !');
    } else {
      let newReport = new Report();
      (newReport.shop = shop),
        (newReport.customer = customer),
        (newReport.type = type),
        (newReport.reason = reason),
        (newReport.description = description),
        (newReport.status = status),
        await reportReposity.save(newReport);
      return new Response(
        HttpStatusCode.CREATED,
        'Create new report successfully !',
        newReport
      );
    }
  }

  static async editStatus(id: number) {
    const report = await reportReposity.update(
      { id: id },
      { status: StatusReportEnum.PROCESSED }
    );
    if (report.affected == 1) {
      return new Response(HttpStatusCode.OK, 'Done!');
    } else {
      return new Response(HttpStatusCode.BAD_REQUEST, 'Not Done!');
    }
  }
}

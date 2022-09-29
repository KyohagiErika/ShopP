import { HttpStatusCode, VoucherTypeEnum, RoleEnum } from './../utils/shopp.enum';
import { Voucher } from './../entities/voucher';
import { ShopPDataSource } from './../data';
import Response from '../utils/response';

export default class VoucherModel {
  static async listAll() {
    const voucherRepository = ShopPDataSource.getRepository(Voucher);
    const vouchers = await voucherRepository.find({
      select: {
        title: true,
        type: true,
        amount: true,
        condition: true,
        mfgDate: true,
        expDate: true,
      },
    });
    return vouchers && vouchers.length > 0 ? vouchers : false;
  }

  static async getOneById(id: string) {
    const voucherRepository = ShopPDataSource.getRepository(Voucher);
    const voucher = await voucherRepository.findOne({
      select: {
        title: true,
        type: true,
        amount: true,
        condition: true,
        mfgDate: true,
        expDate: true,
      },
      where: {
        id,
      },
    });
    return voucher ? voucher : false;
  }

  static async newVoucher(
    title: string,
    type: VoucherTypeEnum,
    createdBy: RoleEnum,
    amount: number,
    condition: string,
    mfgDate: Date,
    expDate: Date
  ) {
    const voucherRepository = ShopPDataSource.getRepository(Voucher);
    const voucher = await voucherRepository.save({
      title,
      type,
      createdBy,
      amount,
      condition,
      mfgDate,
      expDate,
    });
    if (voucher)
      return new Response(
        HttpStatusCode.OK,
        'Create voucher successfully!',
        voucher
      );
    return new Response(HttpStatusCode.BAD_REQUEST, 'Failed');
  }

  static async editVoucher(
    id: string,
    title: string,
    type: VoucherTypeEnum,
    amount: number,
    condition: string,
    mfgDate: Date,
    expDate: Date
  ) {
    const voucherRepository = ShopPDataSource.getRepository(Voucher);
    const result = await voucherRepository.update(id, {
      title,
      type,
      amount,
      condition,
      mfgDate,
      expDate,
    });
    if (result.affected == 1)
      return new Response(HttpStatusCode.OK, 'Update voucher successfully!');
    return new Response(HttpStatusCode.BAD_REQUEST, 'Unavailable voucher');
  }

  static async deleteVoucher(id: string) {
    const voucherRepository = ShopPDataSource.getRepository(Voucher);
    const result = await voucherRepository.delete(id);
    if (result.affected == 1)
      return new Response(HttpStatusCode.OK, 'Delete voucher successfully');
    return new Response(HttpStatusCode.BAD_REQUEST, 'Unavailable voucher');
  }
}

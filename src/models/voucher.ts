import { User } from './../entities/user';
import { HttpStatusCode, VoucherTypeEnum, RoleEnum } from './../utils/shopp.enum';
import { Voucher } from './../entities/voucher';
import { ShopPDataSource } from './../data';
import Response from '../utils/response';
import { MoreThan } from 'typeorm';

export default class VoucherModel {
  static async listAll() {
    const voucherRepository = ShopPDataSource.getRepository(Voucher);
    const now = new Date();
    const vouchers = await voucherRepository.find({
      select: {
        id: true,
        title: true,
        type: true,
        amount: true,
        condition: true,
        mfgDate: true,
        expDate: true,
      },
      where: {
        mfgDate: MoreThan(now),
      },
    });
    return vouchers && vouchers.length > 0 ? vouchers : false;
  }

  static async listShopPVouchers() {
    const voucherRepository = ShopPDataSource.getRepository(Voucher);
    const now = new Date();
    const vouchers = await voucherRepository.find({
      select: {
        id: true,
        title: true,
        type: true,
        amount: true,
        condition: true,
        mfgDate: true,
        expDate: true,
      },
      where: {
        createdBy: { role: { role: RoleEnum.ADMIN } },
        mfgDate: MoreThan(now),
      },
    });
    return vouchers && vouchers.length > 0 ? vouchers : false;
  }

  static async listShopVouchers() {
    const voucherRepository = ShopPDataSource.getRepository(Voucher);
    const now = new Date();
    const vouchers = await voucherRepository.find({
      select: {
        id: true,
        title: true,
        type: true,
        amount: true,
        condition: true,
        mfgDate: true,
        expDate: true,
      },
      where: {
        createdBy: { role: { role: RoleEnum.SHOP } },
        mfgDate: MoreThan(now),
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
    user: User,
    title: string,
    type: VoucherTypeEnum,
    amount: number,
    condition: string,
    mfgDate: Date,
    expDate: Date
  ) {
    const voucherRepository = ShopPDataSource.getRepository(Voucher);
    const voucher = await voucherRepository.save({
      title,
      type,
      roleCreator: user.role.role,
      createdBy: user,
      amount,
      condition,
      mfgDate,
      expDate,
    });
    if (voucher)
      return new Response(HttpStatusCode.OK, 'Create voucher successfully!', {
        id: voucher.id,
        title: voucher.title,
        type: voucher.type,
        amount: voucher.amount,
        condition: voucher.condition,
        mfgDate: voucher.mfgDate,
        expDate: voucher.expDate,
      });
    return new Response(HttpStatusCode.BAD_REQUEST, 'Failed');
  }

  static async editVoucher(
    user: User,
    id: string,
    title: string,
    type: VoucherTypeEnum,
    amount: number,
    condition: string,
    mfgDate: Date,
    expDate: Date
  ) {
    const voucherRepository = ShopPDataSource.getRepository(Voucher);
    const voucher = await voucherRepository.findOne({
      relations: {
        createdBy: { role: true },
      },
      where: {
        id,
      },
    });
    if (voucher == null)
      return new Response(HttpStatusCode.BAD_REQUEST, 'Unavailable Voucher!');
    if (voucher.createdBy.role.role != user.role.role)
      return new Response(
        HttpStatusCode.BAD_REQUEST,
        'Unauthorized error. Invalid role!'
      );
    if (
      voucher.createdBy.role.role == RoleEnum.ADMIN &&
      user.role.role == RoleEnum.ADMIN
    ) {
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
      return new Response(HttpStatusCode.BAD_REQUEST, 'Update voucher failed!');
    }
    if (
      voucher.createdBy.role.role == RoleEnum.SHOP &&
      user.role.role == RoleEnum.SHOP
    ) {
      if (voucher.createdBy.id != user.id)
        return new Response(
          HttpStatusCode.BAD_REQUEST,
          'No access permission!'
        );
    }
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
    return new Response(HttpStatusCode.BAD_REQUEST, 'Update voucher failed!');
  }

  static async deleteVoucher(user: User, id: string) {
    const voucherRepository = ShopPDataSource.getRepository(Voucher);
    const voucher = await voucherRepository.findOne({
      relations: {
        createdBy: { role: true },
      },
      where: {
        id,
      },
    });
    if (voucher == null)
      return new Response(HttpStatusCode.BAD_REQUEST, 'Unavailable Voucher!');
    if (voucher.createdBy.role.role != user.role.role)
      return new Response(
        HttpStatusCode.BAD_REQUEST,
        'Unauthorized error. Invalid role!'
      );
    if (
      voucher.createdBy.role.role == RoleEnum.ADMIN &&
      user.role.role == RoleEnum.ADMIN
    ) {
      const result = await voucherRepository.delete(id);
      if (result.affected == 1)
        return new Response(HttpStatusCode.OK, 'Delete voucher successfully');
      return new Response(HttpStatusCode.BAD_REQUEST, 'Delete voucher failed!');
    }
    if (
      voucher.createdBy.role.role == RoleEnum.SHOP &&
      user.role.role == RoleEnum.SHOP
    ) {
      if (voucher.createdBy.id != user.id)
        return new Response(
          HttpStatusCode.BAD_REQUEST,
          'No access permission!'
        );
    }
    const result = await voucherRepository.delete(id);
    if (result.affected == 1)
      return new Response(HttpStatusCode.OK, 'Delete voucher successfully');
    return new Response(HttpStatusCode.BAD_REQUEST, 'Delete voucher failed!');
  }

  static async saveVoucher(user: User, id: string) {
    const voucherRepository = ShopPDataSource.getRepository(Voucher);
    const voucher = await voucherRepository.findOne({
      relations: {
        customer: true
      },
      where: {
        id
      }
    })
    if(voucher == null) 
      return new Response(HttpStatusCode.BAD_REQUEST, 'Unavailable Voucher!');
    if(user.role.role == RoleEnum.CUSTOMER) {
      voucher.customer
    }
  }
}

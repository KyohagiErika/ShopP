import { Shop } from './../entities/shop';
import { User } from './../entities/user';
import {
  HttpStatusCode,
  VoucherTypeEnum,
  RoleEnum,
} from './../utils/shopp.enum';
import { Voucher } from './../entities/voucher';
import { ShopPDataSource } from './../data';
import Response from '../utils/response';
import { ArrayContains, Like, MoreThan } from 'typeorm';
import { Customer } from '../entities/customer';

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
        expDate: MoreThan(now),
      },
    });
    return vouchers && vouchers.length > 0 ? vouchers : false;
  }

  static async listAppVouchers() {
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
        createdBy: { role: { role: Like(RoleEnum.ADMIN) } },
        expDate: MoreThan(now),
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
        createdBy: { role: { role: Like(RoleEnum.SHOP) } },
        expDate: MoreThan(now),
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
    if (user.role.role == RoleEnum.ADMIN)
      return new Response(
        HttpStatusCode.BAD_REQUEST,
        'Unauthorized error. Invalid role!'
      );
    const voucher = await voucherRepository.findOne({
      relations: {
        customer: true,
      },
      where: {
        id,
      },
    });
    if (voucher == null)
      return new Response(HttpStatusCode.BAD_REQUEST, 'Unavailable Voucher!');
    if (user.role.role >= RoleEnum.CUSTOMER) {
      let length = voucher.customer.length;
      for (let i = 0; i < length; i++) {
        if (voucher.customer[i].id == user.customer.id) {
          return new Response(
            HttpStatusCode.BAD_REQUEST,
            'Already have this voucher!',
            voucher
          );
        }
      }
      voucher.customer.push(user.customer);
      voucherRepository.save(voucher);
      return new Response(HttpStatusCode.OK, 'save voucher successfully!');
    }
    return new Response(HttpStatusCode.BAD_REQUEST, 'Undefined error!');
  }

  static async templateShowCustomerVouchers(
    user: User,
    role: RoleEnum,
    message: string,
    type1?: VoucherTypeEnum,
    type2?: VoucherTypeEnum
  ) {
    const customerRepository = await ShopPDataSource.getRepository(Customer);
    if (user.role.role == RoleEnum.ADMIN)
      return new Response(
        HttpStatusCode.BAD_REQUEST,
        'Unauthorized error. Invalid role!'
      );
    else {
      const customer = await customerRepository.findOne({
        relations: {
          voucher: true,
        },
        where: {
          id: user.customer.id,
        },
      });
      if (customer == null) {
        return new Response(
          HttpStatusCode.BAD_REQUEST,
          'must sign up customer before!'
        );
      }
      const now = new Date();
      let voucherALL = customer.voucher;
      let vouchers: object[] = [];
      if(type1 == undefined) {
        voucherALL.forEach(voucher => {
          if (
            voucher.roleCreator == role &&
              voucher.expDate > now 
          ) {
            vouchers.push({
              id: voucher.id,
              title: voucher.title,
              type: voucher.type,
              condition: voucher.condition,
              mfgDate: voucher.mfgDate,
              expDate: voucher.expDate,
            });
          }
        });
      } else if(type2 == undefined) {
        voucherALL.forEach(voucher => {
          if (
            voucher.roleCreator == role &&
            voucher.expDate > now &&
            voucher.type == type1
          ) {
            vouchers.push({
              id: voucher.id,
              title: voucher.title,
              type: voucher.type,
              condition: voucher.condition,
              mfgDate: voucher.mfgDate,
              expDate: voucher.expDate,
            });
          }
        });
      } else {
        voucherALL.forEach(voucher => {
          if (
            voucher.roleCreator == role &&
            voucher.expDate > now &&
            (voucher.type == type1 || voucher.type == type2)
          ) {
            vouchers.push({
              id: voucher.id,
              title: voucher.title,
              type: voucher.type,
              condition: voucher.condition,
              mfgDate: voucher.mfgDate,
              expDate: voucher.expDate,
            });
          }
        });
      }
      if (vouchers.length == 0)
        return new Response(
          HttpStatusCode.BAD_REQUEST,
          'unavailable vouchers!!'
        );
      return new Response(HttpStatusCode.OK, message, vouchers);
    }
  }

  static async showCustomerAppVouchers(user: User) {
    return this.templateShowCustomerVouchers(
      user,
      RoleEnum.ADMIN,
      'show App vouchers successfully!!'
    );
  }

  static async showCustomerShopVouchers(user: User) {
    return this.templateShowCustomerVouchers(
      user,
      RoleEnum.SHOP,
      'show Shop vouchers successfully!!'
    );
  }

  static async showCustomerFreeshipVouchers(user: User) {
    return this.templateShowCustomerVouchers(
      user,
      RoleEnum.ADMIN,
      'show Freeship vouchers successfully!!',
      VoucherTypeEnum.FREESHIP
    );
  }

  static async showCustomerDiscountVouchers(user: User) {
    return this.templateShowCustomerVouchers(
      user,
      RoleEnum.ADMIN,
      'show Discount vouchers successfully!!',
      VoucherTypeEnum.MONEY,
      VoucherTypeEnum.PERCENT
    );
  }

  static async deleteCustomerVoucher(user: User, id: string) {
    const customerRepository = ShopPDataSource.getRepository(Customer)
    const now = new Date()
    const customer = await customerRepository.findOne({
      relations: {
        voucher: true
      },
      select: {
        id: true
      },
      where: {
        id: user.customer.id,
        voucher: {expDate: MoreThan(now)}
      }
    })
    if(customer == null) 
      return new Response(HttpStatusCode.BAD_REQUEST,'Customer not exist')
    let length = customer.voucher.length
    customer.voucher =  customer.voucher.filter((item) => {
      return item.id != id
    })
    if(length == customer.voucher.length) 
      return new Response(HttpStatusCode.BAD_REQUEST, 'Unavailable voucher')
    return new Response(HttpStatusCode.OK, 'Delete voucher successfully!!')
  }


}


import { User } from "./../entities/user";
import { Customer } from "./../entities/customer";
import { validate } from "class-validator";
import { ShopPDataSource } from "../data";
import { StatusEnum, GenderEnum } from "../utils/shopp.enum";

export default class CustomerModel {
  static async listAll() {
    const customerRepository = ShopPDataSource.getRepository(Customer);
    const customers = await customerRepository.find({
      relations: {
        user: true,
      },
      select: {
        id: true,
        name: true,
        avatar: true,
        gender: true,
        dob: true,
        placeOfDelivery: true,
        // not need following shops
      },
      where: {
        user: { status: StatusEnum.ACTIVE },
      },
    });
    return customers && customers.length > 0 ? customers : false;
  }

  static async getOneById(customerId: string) {
    const customerRepository = ShopPDataSource.getRepository(Customer);
    try {
      const customer = await customerRepository.findOneOrFail({
        relations: {
          user: true,
        },
        select: {
          id: true,
          name: true,
          avatar: true,
          gender: true,
          dob: true,
          placeOfDelivery: true,
          followingShops: true,
        },
        where: {
          id: customerId,
          user: { status: StatusEnum.ACTIVE },
        },
      });
      return customer ? customer : false;
    } catch (error) {
      return error;
    }
  }

  static async postNew(
    name: string,
    gender: GenderEnum,
    dob: Date,
    placeOfDelivery: string,
    userId: number
  ) {
    let customer = new Customer();
    customer.name = name;
    customer.gender = gender;
    customer.dob = dob;
    customer.placeOfDelivery = placeOfDelivery;
    const userRepository = ShopPDataSource.getRepository(User);
    let user;
    try {
      user = userRepository.findOneOrFail({
        where: {
          id: userId,
          status: StatusEnum.ACTIVE,
        },
      });
    } catch (e) {
      return e;
    }
    customer.user = await user;
    const errorsCustomer = await validate(customer);
    if (errorsCustomer.length > 0) {
      return errorsCustomer;
    }

    const customerRepository = ShopPDataSource.getRepository(Customer);
    try {
      await customerRepository.save(customer);
    } catch (e) {
      return e;
    }
    //If all ok, send 201 response
    //res.status(201).send("Customer created");
    return customer;
  }

  static async edit(
    id: string,
    name: string,
    gender: GenderEnum,
    dob: Date,
    placeOfDelivery: string
  ) {
    // find customer on database
    const customerRepository = ShopPDataSource.getRepository(Customer);
    try {
      let customer: Customer | null = await customerRepository.findOne({
        where: {
          id: id,
          user: { status: StatusEnum.ACTIVE },
        },
      });
      if (customer) {
        customer.id = id;
        customer.name = name;
        customer.gender = gender;
        customer.dob = dob;
        customer.placeOfDelivery = placeOfDelivery;
        const errors = await validate(customer);
        if (errors.length > 0) {
          return errors;
        }

        try {
          await customerRepository.save(customer);
        } catch (e) {
          return e;
        }
      } else return false;

      return true;
    } catch (error) {
      return error;
    }
  }
}

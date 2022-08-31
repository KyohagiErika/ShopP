import { Customer } from "./../entities/customer";
import { validate } from "class-validator";
import { ShopPDataSource } from "../data";
import { User } from "../entities/user";
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
        followingShops: true,
      },
    });
    return customers && customers.length > 0 ? customers : false;
  }

  static async getOneById(customerId: string) {
    const customerRepository = ShopPDataSource.getRepository(Customer);
    try {
      const customer = await customerRepository.findOneOrFail({
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
    avatar: number | undefined,
    placeOfDelivery: string
  ) {
    let customer = new Customer();
    customer.name = name;
    customer.gender = gender;
    customer.dob = dob;
    customer.avatar = avatar;
    customer.placeOfDelivery = placeOfDelivery;

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
    avatar: number | null | undefined,
    gender: GenderEnum,
    dob: Date | null | undefined,
    placeOfDelivery: string
  ) {
    // find customer on database
    const customerRepository = ShopPDataSource.getRepository(Customer);
    let customer: Customer | undefined | null
    if (customer !== undefined && customer !== null) {
      try {
        customer = await customerRepository.findOne({
          where: {
            id: id,
          },
        });
        if (customer) {
          customer.id = id;
          customer.name = name;
          customer.avatar = avatar;
          customer.gender = gender;
          customer.dob = dob;
          customer.placeOfDelivery = placeOfDelivery
          const errors = await validate(customer);
          if (errors.length > 0) {
            return errors;
          }

          try {
            await customerRepository.save(customer);
          } catch (e) {
            return e;
          }
        }
        

        return true
      } catch(error) {
        return error
      }
    }
  }
  static async delete(id:number) {
    const customerRepository =ShopPDataSource.getRepository(Customer)
    let customer: Customer | null |undefined
    if(customer !==null && customer !==undefined) {
      try {
        customer =await customerRepository.findOne({
          where: {
            id:id,
          }
        })
      }catch(error) {
        return error
      }
    }
  }
}

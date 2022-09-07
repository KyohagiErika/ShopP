import { validate } from 'class-validator';
import { ShopPDataSource } from '../data';
import { User } from '../entities/user';
import { UserRole } from '../entities/userRole';
import { StatusEnum, RoleEnum } from '../utils/shopp.enum';
import { ErrorElement } from "../utils/decorators"

const userRepository = ShopPDataSource.getRepository(User);
const userRoleRepository = ShopPDataSource.getRepository(UserRole);

export default class UserModel {

  static async listAll() {
    const users = await userRepository.find({
      relations: {
        roles: true,
      },
      select: {
        id: true,
        email: true,
        phone: true,
        roles: {
          role: true,
        },
      },
      where: {
        status: StatusEnum.ACTIVE,
      },
    });
    return users && users.length > 0 ? users : false;
  }

  static async getOneById(userId: number) {
    const user = await userRepository.findOneOrFail({
      select: {
        id: true,
        email: true,
        phone: true,
        roles: {
          role: true,
        },
      },
      where: {
        id: userId,
        status: StatusEnum.ACTIVE,
      },
    });
    return user ? user : false;
  }

  static async postNew(email: string, phone: string, password: string, role: RoleEnum) {
    const emailUser: User | null = await userRepository.findOne({
      where: {
        email: email,
        status: StatusEnum.ACTIVE
      }
    });

    let err = new Array<ErrorElement>();
    if (emailUser != null) {
      err.push({
        at: 'email',
        message: `Email already exist.`,
      });
      return err;
    } else {
      //Get parameters from the body
      let user = new User();
      user.email = email;
      user.phone = phone;
      user.password = password;
      user.hashPassword();;

      await userRepository.save(user);
      await userRoleRepository.save({ role: role, user: user });

      return true;
    }
  }

  static async edit(id: number, email: string, phone: string) {

    const result = await userRepository.update({
      id: id,
      status: StatusEnum.ACTIVE
    }, {email: email, phone: phone})
    return result;

    // const user: User | null = await userRepository.findOne({
    //   where: {
    //     id: id,
    //     status: StatusEnum.ACTIVE
    //   },
    // });
    // let err = new Array<ErrorElement>();
    // if (user !== null) {
    //   user.email = email;//validate email
    //   user.phone = phone;//validate phone
    //   await userRepository.save(user);
    //   return true;
    // }
    // err.push({
    //   at: 'id',
    //   message: `User not exist.`,
    // });
    // return err;
    //After all send a 204 (no content, but accepted) response
  }

  static async delete(userId: number) {
    const user: User | null = await userRepository.findOne({
      where: {
        id: userId,
        status: StatusEnum.ACTIVE
      }
    });
    if (user !== null) {
      //Validate the new values on model
      user.status = StatusEnum.INACTIVE;
      await userRepository.save(user);
      return true;
    }
    let err = new Array<ErrorElement>();
    err.push({
      at: 'id',
      message: `User not exist.`,
    });
    return err;
  }
}

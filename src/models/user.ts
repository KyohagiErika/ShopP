import { ShopPDataSource } from '../data';
import { User } from '../entities/user';
import { UserRole } from '../entities/userRole';
import { StatusEnum, RoleEnum, HttpStatusCode } from '../utils/shopp.enum';
import Response from '../utils/response';

const userRepository = ShopPDataSource.getRepository(User);
const userRoleRepository = ShopPDataSource.getRepository(UserRole);

export default class UserModel {
  static async listAll() {
    const users = await userRepository.find({
      relations: {
        roles: true,
        customer: true
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
    const user = await userRepository.findOne({
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
        id: userId,
        status: StatusEnum.ACTIVE,
      },
    });
    return user ? user : false;
  }

  static async postNew(
    email: string,
    phone: string,
    password: string,
    role: RoleEnum
  ) {
    const emailUser: User | null = await userRepository.findOne({
      where: {
        email: email,
        status: StatusEnum.ACTIVE,
      },
    });
    if (emailUser != null) {
      return new Response(HttpStatusCode.BAD_REQUEST, 'Email already exist.');
    }

    const phoneUser: User | null = await userRepository.findOne({
      where: {
        phone: phone,
        status: StatusEnum.ACTIVE,
      },
    });
    if (phoneUser != null) {
      return new Response(HttpStatusCode.BAD_REQUEST, 'Phone already exist.');
    }

    //Get parameters from the body
    let user = new User();
    user.email = email;
    user.phone = phone;
    user.password = password;
    user.hashPassword();

    await userRepository.save(user);
    await userRoleRepository.save({ role: role, user: user });

    return new Response(
      HttpStatusCode.CREATED,
      'Create new user successfully!',
      user
    );
  }

  static async edit(id: number, email: string, phone: string) {
    const user: User | null = await userRepository.findOne({
      where: {
        id: id,
        status: StatusEnum.ACTIVE,
      },
    });
    if (user == null) {
      return new Response(HttpStatusCode.BAD_REQUEST, 'User not exist.');
    }

    const emailUser: User | null = await userRepository.findOne({
      where: {
        email: email,
        status: StatusEnum.ACTIVE,
      },
    });
    if (emailUser != null && emailUser.email != user.email) {
      return new Response(HttpStatusCode.BAD_REQUEST, 'Email already exist.');
    }

    const phoneUser: User | null = await userRepository.findOne({
      where: {
        phone: phone,
        status: StatusEnum.ACTIVE,
      },
    });
    if (phoneUser != null && phoneUser.phone !== user.phone) {
      return new Response(HttpStatusCode.BAD_REQUEST, 'Phone already exist.');
    }

    const result = await userRepository.update(
      {
        id: id,
        status: StatusEnum.ACTIVE,
      },
      { email: email, phone: phone }
    );
    if (result.affected == 1) {
      return new Response(HttpStatusCode.OK, 'Edit user successfully!');
    } else {
      return new Response(HttpStatusCode.BAD_REQUEST, 'Edit user failed!');
    }
  }

  static async delete(userId: number) {
    const user: User | null = await userRepository.findOne({
      where: {
        id: userId,
        status: StatusEnum.ACTIVE,
      },
    });
    if (user == null) {
      return new Response(HttpStatusCode.BAD_REQUEST, 'User not exist.');
    }

    const result = await userRepository.update(
      {
        id: userId,
        status: StatusEnum.ACTIVE,
      },
      { status: StatusEnum.INACTIVE }
    );
    if (result.affected == 1) {
      return new Response(HttpStatusCode.OK, 'Delete user successfully!');
    } else {
      return new Response(HttpStatusCode.BAD_REQUEST, 'Delete user failed!');
    }
  }
}

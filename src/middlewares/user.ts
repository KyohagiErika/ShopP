import { Request, Response } from 'express';
import UserModel from '../models/user';
import { ControllerService } from '../utils/decorators';
import { HttpStatusCode, RoleEnum } from '../utils/shopp.enum';

export default class UserMiddleware {
  @ControllerService()
  static async listAll(req: Request, res: Response) {
    const result = await UserModel.listAll();
    if (result) {
      res.status(HttpStatusCode.OK).send({ data: result });
    } else {
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ message: 'Get all users failed!' });
    }
  }

  @ControllerService()
  static async getOwn(req: Request, res: Response) {
    res.status(HttpStatusCode.OK).send({ data: res.locals.user });
  }

  /**
   * @swagger
   * components:
   *  schemas:
   *   CreateNewUserRequest:
   *    type: object
   *    properties:
   *     email:
   *      type: string
   *      description: email of the user
   *      example: 'shopp123@gmail.com'
   *     phone:
   *      type: string
   *      description: phone of the user
   *      example: '0987654321'
   *     password:
   *      type: string
   *      description: password of the user
   *      example: 'abcABC213&'
   *     confirmPassword:
   *      type: string
   *      description: confirm password of the user
   *      example: 'abcABC213&'
   */
  @ControllerService({
    body: [
      {
        name: 'email',
        type: String,
        validator: (propName: string, value: string) => {
          const emailRegExp: RegExp = /^[\w\.-]+@([\w-]+\.)+[\w-]{2,4}$/;
          if (!emailRegExp.test(value))
            return `${propName} must be valid email`;
          return null;
        },
      },
      {
        name: 'password',
        type: String,
        validator: (propName: string, value: string) => {
          const pwdRegExp: RegExp =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*(\-_+=`~\?\/])(?=.{8,})/;
          if (!pwdRegExp.test(value))
            return `${propName} must contain 8 characters or longer, at least one lowercase, one uppercase, one number and one special character`;
          return null;
        },
      },
      {
        name: 'confirmPassword',
        type: String,
        validator: (propName: string, value: string) => {
          const pwdRegExp: RegExp =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*(\-_+=`~\?\/])(?=.{8,})/;
          if (!pwdRegExp.test(value))
            return `${propName} must contain 8 characters or longer, at least one lowercase, one uppercase, one number and one special character`;
          return null;
        },
      },
      {
        name: 'phone',
        type: String,
        validator: (propName: string, value: string) => {
          const phoneRegExp: RegExp = /^(01|03|05|07|08|09)+([0-9]{8})\b/;
          if (!phoneRegExp.test(value))
            return `${propName} must be valid phone`;
          return null;
        },
      },
    ],
  })
  static async postNew(req: Request, res: Response) {
    const data = req.body;
    if (data.password !== data.confirmPassword)
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ message: 'Confirmed Password must be equal to Password' });
    const result = await UserModel.postNew(
      String(data.email).toLowerCase(),
      data.phone,
      data.password,
      RoleEnum.CUSTOMER
    );
    if (result.getCode() === HttpStatusCode.OK) {
      res
        .status(result.getCode())
        .send({ message: result.getMessage(), data: result.getData() });
    } else {
      res.status(result.getCode()).send({ message: result.getMessage() });
    }
  }

  @ControllerService({
    body: [
      {
        name: 'email',
        type: String,
        validator: (propName: string, value: string) => {
          const emailRegExp: RegExp = /^[\w\.-]+@([\w-]+\.)+[\w-]{2,4}$/;
          if (!emailRegExp.test(value))
            return `${propName} must be valid email`;
          return null;
        },
      },
      {
        name: 'password',
        type: String,
        validator: (propName: string, value: string) => {
          const pwdRegExp: RegExp =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*(\-_+=`~\?\/])(?=.{8,})/;
          if (!pwdRegExp.test(value))
            return `${propName} must contain 8 characters or longer, at least one lowercase, one uppercase, one number and one special character`;
          return null;
        },
      },
      {
        name: 'confirmPassword',
        type: String,
        validator: (propName: string, value: string) => {
          const pwdRegExp: RegExp =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*(\-_+=`~\?\/])(?=.{8,})/;
          if (!pwdRegExp.test(value))
            return `${propName} must contain 8 characters or longer, at least one lowercase, one uppercase, one number and one special character`;
          return null;
        },
      },
      {
        name: 'phone',
        type: String,
        validator: (propName: string, value: string) => {
          const phoneRegExp: RegExp = /^(01|03|05|07|08|09)+([0-9]{8})\b/;
          if (!phoneRegExp.test(value))
            return `${propName} must be valid phone`;
          return null;
        },
      },
    ],
  })
  static async postNewAdmin(req: Request, res: Response) {
    const data = req.body;
    if (data.password !== data.confirmPassword)
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ message: 'Confirmed Password must be equal to Password' });
    const result = await UserModel.postNew(
      String(data.email).toLowerCase(),
      data.phone,
      data.password,
      RoleEnum.ADMIN
    );
    if (result.getCode() === HttpStatusCode.CREATED) {
      res
        .status(result.getCode())
        .send({ message: result.getMessage(), data: result.getData() });
    } else {
      res.status(result.getCode()).send({ message: result.getMessage() });
    }
  }

  /**
   * @swagger
   * components:
   *  schemas:
   *   EditUserRequest:
   *    type: object
   *    properties:
   *     email:
   *      type: string
   *      description: email of the user
   *      example: 'shopp123@gmail.com'
   *     phone:
   *      type: string
   *      description: phone of the user
   *      example: '0987654321'
   */
  @ControllerService({
    body: [
      {
        name: 'email',
        type: String,
        validator: (propName: string, value: string) => {
          const emailRegExp: RegExp = /^[\w\.-]+@([\w-]+\.)+[\w-]{2,4}$/;
          if (!emailRegExp.test(value))
            return `${propName} must be valid email`;
          return null;
        },
      },
      {
        name: 'phone',
        type: String,
        validator: (propName: string, value: string) => {
          const phoneRegExp: RegExp = /^(01|03|05|07|08|09)+([0-9]{8})\b/;
          if (!phoneRegExp.test(value))
            return `${propName} must be valid phone`;
          return null;
        },
      },
    ],
  })
  static async edit(req: Request, res: Response) {
    const data = req.body;
    const id = res.locals.user.id;
    const result = await UserModel.edit(
      id,
      String(data.email).toLowerCase(),
      data.phone
    );
    res.status(result.getCode()).send({ message: result.getMessage() });
  }

  @ControllerService()
  static async delete(req: Request, res: Response) {
    const id = res.locals.user.id;
    const result = await UserModel.delete(id);
    res.status(result.getCode()).send({ message: result.getMessage() });
  }

  @ControllerService()
  static async ban(req: Request, res: Response) {
    const id = +req.params.id;
    const result = await UserModel.ban(id);
    res.status(result.getCode()).send({ message: result.getMessage() });
  }
}

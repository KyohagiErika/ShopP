import { Request, Response } from 'express';
import { ShopPDataSource } from '../data';
import { validate } from 'class-validator';
import { User } from '../entities/user';
import config from '../utils/shopp.config';
import { ControllerService } from '../utils/decorators';
import { HttpStatusCode, StatusEnum } from '../utils/shopp.enum';
import AuthModel from '../models/auth';

class AuthMiddleware {
  // @ControllerService({
  //   deepWatch: false,
  //   query: [
  //     {
  //       name: 'hello',
  //     },
  //   ],
  //   body: [
  //     {
  //       name: 'test',
  //       type: Number,
  //       validator: (propertyName: string, value: number) => {
  //         if (value < 10) {
  //           return `${propertyName} must greater or equal to 10`;
  //         }
  //         return null;
  //       },
  //     },
  //   ],
  // })
  // static async test(req: Request, res: Response) {
  //   // throw new Error('test error');
  //   res.send({ message: 'Success!' });
  //   // res.send('asdasd');
  // }

  @ControllerService({
    body: [
      {
        name: 'email',
        type: String,
        validator: (propName: string, value: string) => {
          const emailRegExp: RegExp =
            /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
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
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
          if (!pwdRegExp.test(value))
            return `${propName} must constain 8 characters or longer, at least one lowercase, one uppercase, one number and one special character`;
          return null;
        },
      },
    ],
  })
  static async loginWithEmail(req: Request, res: Response) {
    const data = req.body;
    const result = await AuthModel.loginWithEmail(data.email, data.password);
    if (result.getCode() === HttpStatusCode.OK) {
      //Send the jwt in the response
      res.setHeader('auth', result.getData());
      res
        .status(result.getCode())
        .send({ message: result.getMessage(), token: result.getData() });
    } else {
      res.status(result.getCode()).send({ message: result.getMessage() });
    }
  }

  @ControllerService({
    body: [
      {
        name: 'oldPassword',
        type: String,
        validator: (propName: string, value: string) => {
          const pwdRegExp: RegExp =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
          if (!pwdRegExp.test(value))
            return `${propName} must constain 8 characters or longer, at least one lowercase, one uppercase, one number and one special character`;
          return null;
        },
      },
      {
        name: 'newPassword',
        type: String,
        validator: (propName: string, value: string) => {
          const pwdRegExp: RegExp =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
          if (!pwdRegExp.test(value))
            return `${propName} must constain 8 characters or longer, at least one lowercase, one uppercase, one number and one special character`;
          return null;
        },
      },
    ],
  })
  static async changePassword(req: Request, res: Response) {
    //Get ID from JWT
    const id = res.locals.jwtPayload.userId;

    //Get parameters from the body
    const data = req.body;

    const result = await AuthModel.changePassword(
      id,
      data.oldPassword,
      data.newPassword
    );
    res.status(result.getCode()).send({ message: result.getMessage() });
  }
}
export default AuthMiddleware;

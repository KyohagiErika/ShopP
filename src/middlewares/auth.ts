import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ControllerService } from '../utils/decorators';
import { HttpStatusCode } from '../utils/shopp.enum';
import AuthModel from '../models/auth';
import config from '../utils/shopp.config';

class AuthMiddleware {
  @ControllerService({
    body: [
      {
        name: 'email',
        type: String,
        validator: (propName: string, value: string) => {
          const emailRegExp: RegExp =
            /^[\w\.-]+@([\w-]+\.)+[\w-]{2,4}$/;
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

  @ControllerService({
    body: [
      {
        name: 'email',
        type: String,
        validator: (propName: string, value: string) => {
          const emailRegExp: RegExp =
            /^[\w\.-]+@([\w-]+\.)+[\w-]{2,4}$/;
          if (!emailRegExp.test(value))
            return `${propName} must be valid email`;
          return null;
        },
      }
    ]
  })
  static async forgotPassword(req: Request, res: Response) {
    //Get parameters from the body
    const data = req.body;

    const result = await AuthModel.forgotPassword(
      data.email
    );
    res.status(result.getCode()).send({ message: result.getMessage() });
  }

  @ControllerService()
  static async checkJwt(req: Request, res: Response, next: NextFunction) {
    //Get the jwt token from the head
    const token = <string>req.headers['auth'];
    if (token == "")
      res
        .status(HttpStatusCode.UNAUTHORIZATION)
        .send({ message: 'Unauthorized error, Token is missing' });
    let jwtPayload;

    //Try to validate the token and get data
    try {
      jwtPayload = <any>jwt.verify(token, config.JWT_SECRET);
      res.locals.jwtPayload = jwtPayload;
    } catch (error) {
      //If token is not valid, respond with 401 (unauthorized)
      res
        .status(HttpStatusCode.UNAUTHORIZATION)
        .send({ message: 'Unauthorized error, token is invalid!' });
      return;
    }

    //The token is valid for 1 hour
    //We want to send a new token on every request
    const { userId, userEmail } = jwtPayload;
    const newToken = jwt.sign({ userId, userEmail }, config.JWT_SECRET, {
      expiresIn: '1h',
    });
    res.setHeader('auth', newToken);

    //Call the next middleware or controller
    next();
  }
}
export default AuthMiddleware;

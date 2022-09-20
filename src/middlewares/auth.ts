import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ControllerService } from '../utils/decorators';
import { HttpStatusCode, OtpEnum } from '../utils/shopp.enum';
import AuthModel from '../models/auth';
import config from '../utils/shopp.config';
import resetPasswordTemplate from '../utils/templates/resetPasswordTemplate';
import SendGmailMiddleware from './sendGmail';
import UserModel from '../models/user';
import { generateOtp } from '../utils';

class AuthMiddleware {
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
          const emailRegExp: RegExp = /^[\w\.-]+@([\w-]+\.)+[\w-]{2,4}$/;
          if (!emailRegExp.test(value))
            return `${propName} must be valid email`;
          return null;
        },
      },
    ],
  })
  static async forgotPassword(req: Request, res: Response) {
    //Get parameters from the body
    const data = req.body;

    const user = await UserModel.getOneByEmail(data.email);
    if (!user) res.status(HttpStatusCode.BAD_REQUEST).send({ message: 'Wrong email' });
    else {
      let tokenExpiration: Date = new Date();
      tokenExpiration.setMinutes(5 + tokenExpiration.getMinutes());

      const otp: string = generateOtp(6);

      await AuthModel.postUserOtp(user, OtpEnum.FORGET, otp, tokenExpiration);

      const emailTemplate = resetPasswordTemplate(
        otp,
        user.customer.name
      );

      const sendGmail = SendGmailMiddleware.getInstance();
      await sendGmail.createConnection();
      await sendGmail.sendMail({
        from: config.SMTP_SENDER,
        to: user.email,
        subject: "Reset password",
        text: "Hello from ShopP",
        html: emailTemplate.html
      }, function (err: any, success: any) {
        if (err) res.status(HttpStatusCode.UNKNOW_ERROR).send({ err: err });
        else res.status(HttpStatusCode.OK).send({ message: "OTP Reset Password OTP was sent via your email successfully" });
      });
    }
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
      }, {
        name: 'otp',
        type: String,
        validator: (propName: string, value: string) => {
          const otpRegExp: RegExp =
            /^[0-9]{6}$/;
          if (!otpRegExp.test(value))
            return `${propName} must be valid OTP`;
          return null;
        },
      }
    ]
  })
  static async verifyForgotPassword(req: Request, res: Response) {
    const data = req.body;
    const user = await UserModel.getOneByEmail(data.email);
    if (!user) res.status(HttpStatusCode.BAD_REQUEST).send({ message: 'Wrong email' });
    else {
      const result = await AuthModel.verifyOtp(user.id, data.otp, OtpEnum.FORGET);
      res.status(result.getCode()).send({ message: result.getMessage() });
    }
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
      }, {
        name: 'otp',
        type: String,
        validator: (propName: string, value: string) => {
          const otpRegExp: RegExp =
            /^[0-9]{6}$/;
          if (!otpRegExp.test(value))
            return `${propName} must be valid OTP`;
          return null;
        },
      }, {
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
      {
        name: 'confirmPassword',
        type: String,
        validator: (propName: string, value: string) => {
          const pwdRegExp: RegExp =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
          if (!pwdRegExp.test(value))
            return `${propName} must constain 8 characters or longer, at least one lowercase, one uppercase, one number and one special character`;
          return null;
        },
      },
    ]
  })
  static async resetPassword(req: Request, res: Response) {
    const data = req.body;
    if (data.password !== data.confirmPassword) res.status(HttpStatusCode.BAD_REQUEST).send({ message: 'Wrong confirm password' });

    const user = await UserModel.getOneByEmail(data.email);
    if (!user) res.status(HttpStatusCode.BAD_REQUEST).send({ message: 'Wrong email' });
    else {
      const result = await AuthModel.verifyOtp(user.id, data.otp, OtpEnum.FORGET);
      if (result.getCode() != HttpStatusCode.OK) res.status(result.getCode()).send({ message: result.getMessage() });
      else {
        const reset = await AuthModel.resetPassword(user.id, data.password);
        if (reset.getCode() == HttpStatusCode.OK)
          await AuthModel.deleteUserOtp(user.id, OtpEnum.FORGET, data.otp);
        res.status(reset.getCode()).send({ message: reset.getMessage() });
      }
    }
  }

  static async checkJwt(req: Request, res: Response, next: NextFunction) {
    //Get the jwt token from the head
    let token = <string>req.header('Authorization');
    if (token == '')
      res
        .status(HttpStatusCode.UNAUTHORIZATION)
        .send({ message: 'Unauthorized error, Token is missing' });
    let jwtPayload;
    token = token?.replace('Bearer ', '');
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
    res.setHeader('Authorization', newToken);

    //Call the next middleware or controller
    next();
  }
}
export default AuthMiddleware;

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
import { User } from '../entities/user';
import verifyEmail from '../utils/templates/verifyEmailTemplate';

class AuthMiddleware {
  /**
   * @swagger
   * components:
   *  schemas:
   *   LoginRequest:
   *    type: object
   *    properties:
   *     emailOrPhone:
   *      type: string
   *      description: email or phone of the user
   *      example: 'shopp123@gmail.com'
   *     password:
   *      type: string
   *      description: password of the user
   *      example: 'abcABC213&'
   * */
  /**
   * @swagger
   * components:
   *  responses:
   *   LoginResponse:
   *    type: object
   *    properties:
   *     message:
   *      type: string
   *      description: message
   *      example: 'Login successfully'
   *     token:
   *      type: string
   *      description: token of the user
   *      example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjksImVtYWlsIjoidHRpZW52bXNlMTcwMTMwQGZwdC5lZHUudm4iLCJpYXQiOjE2NjcwNDkyMTQsImV4cCI6MTY2NzA1MjgxNH0.w4WZTxZ4Q-HQ4p1PbJ-x-tz1XNap_zNRMoOPy6xUoTo'
   */
  @ControllerService({
    body: [
      {
        name: 'emailOrPhone',
        type: String,
        validator: (propName: string, value: string) => {
          const phoneRegExp: RegExp = /^(01|03|05|07|08|09)+([0-9]{8})\b/;
          const emailRegExp: RegExp = /^[\w\.-]+@([\w-]+\.)+[\w-]{2,4}$/;
          if (!emailRegExp.test(value))
            if (!phoneRegExp.test(value))
              return `Email or Phone must be valid.`;
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
  static async loginWithEmailOrPhone(req: Request, res: Response) {
    const data = req.body;
    let flag: boolean = false;
    if (String(data.emailOrPhone).includes('@')) flag = true;
    const result = await AuthModel.loginWithEmailOrPhone(
      String(data.emailOrPhone).toLowerCase(),
      data.password,
      flag
    );
    if (result.getCode() === HttpStatusCode.OK) {
      res.cookie('jwt', result.getData().refreshToken, {
        httpOnly: true,
        sameSite: 'none',
        //secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });
      res
        .status(result.getCode())
        .send({ message: result.getMessage(), token: result.getData().token });
    } else {
      res.status(result.getCode()).send({ message: result.getMessage() });
    }
  }

  /**
   * @swagger
   * components:
   *  schemas:
   *   ChangePasswordRequest:
   *    type: object
   *    properties:
   *     oldPassword:
   *      type: string
   *      description: old password of the user
   *      example: 'abcABC213&'
   *     newPassword:
   *      type: string
   *      description: new password of the user
   *      example: 'abcABC213&123'
   *     confirmNewPassword:
   *      type: string
   *      description: confirm password of the user
   *      example: 'abcABC213&123'
   * */
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
      {
        name: 'confirmNewPassword',
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
    const id = res.locals.user.id;

    //Get parameters from the body
    const data = req.body;
    if (data.newPassword !== data.confirmNewPassword)
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ message: 'Wrong confirm new password' });
    if (data.oldPassword == data.newPassword)
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ message: 'New password must be different from Old password' });

    const result = await AuthModel.changePassword(
      id,
      data.oldPassword,
      data.newPassword
    );
    res.status(result.getCode()).send({ message: result.getMessage() });
  }

  /**
   * @swagger
   * components:
   *  schemas:
   *   ForgotPasswordRequest:
   *    type: object
   *    properties:
   *     oldPassword:
   *      type: string
   *      description: password of the user
   *      example: 'abcABC213&'
   *     newPassword:
   *      type: string
   *      description: password of the user
   *      example: 'abcABfsdfC213&'
   *     confirmNewPassword:
   *      type: string
   *      description: confirm password of the user
   *      example: 'abcABfsdfC213&'
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
    ],
  })
  static async forgotPassword(req: Request, res: Response) {
    //Get parameters from the body
    const email = req.body.email;

    const user = await UserModel.getOneByEmail(String(email).toLowerCase());
    if (!user)
      res.status(HttpStatusCode.BAD_REQUEST).send({ message: 'Wrong email' });
    else {
      let tokenExpiration: Date = new Date();
      tokenExpiration.setMinutes(10 + tokenExpiration.getMinutes());

      const otp: string = generateOtp(6);

      await AuthModel.postUserOtp(user, OtpEnum.FORGET, otp, tokenExpiration);
      let name = '';
      if (user.customer == null || user.customer.name == null)
        name = 'Our Customer';
      else name = user.customer.name;

      const emailTemplate = resetPasswordTemplate(otp, name);

      const sendGmail = SendGmailMiddleware.getInstance();
      await sendGmail.createConnection();
      await sendGmail.sendMail(
        {
          from: config.SMTP_SENDER,
          to: user.email,
          subject: 'Reset password',
          text: 'Hello from ShopP',
          html: emailTemplate.html,
        },
        function (err: any, success: any) {
          if (err) res.status(HttpStatusCode.UNKNOWN_ERROR).send({ err: err });
          else
            res.status(HttpStatusCode.OK).send({
              message:
                'OTP Reset Password OTP was sent via your email successfully',
            });
        }
      );
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
    ],
  })
  static async sendGmailForVerifyingEmail(req: Request, res: Response) {
    //Get email from the body
    const email = req.body.email;
    const user = await UserModel.getOneByEmail(String(email).toLowerCase());
    if (!user)
      res.status(HttpStatusCode.BAD_REQUEST).send({ message: 'Invalid email' });
    else {
      let tokenExpiration: Date = new Date();
      tokenExpiration.setMinutes(10 + tokenExpiration.getMinutes());

      const otp: string = generateOtp(6);

      await AuthModel.postUserOtp(
        user,
        OtpEnum.VERIFICATION,
        otp,
        tokenExpiration
      );
      let name = '';
      if (user.customer == null || user.customer.name == null)
        name = 'Our Customer';
      else name = user.customer.name;

      const emailTemplate = verifyEmail(otp, name);

      const sendGmail = SendGmailMiddleware.getInstance();
      await sendGmail.createConnection();
      await sendGmail.sendMail(
        {
          from: config.SMTP_SENDER,
          to: email,
          subject: 'Verify Your Login Email',
          text: 'Hello from ShopP',
          html: emailTemplate.html,
        },
        function (err: any, success: any) {
          if (err) res.status(HttpStatusCode.UNKNOWN_ERROR).send({ err: err });
          else
            res.status(HttpStatusCode.OK).send({
              message:
                'Verifying Email OTP was sent via your email successfully',
            });
        }
      );
    }
  }

  /**
   * @swagger
   * components:
   *  schemas:
   *   VerifyEmailRequest:
   *    type: object
   *    properties:
   *     email:
   *      type: string
   *      description: email of the user
   *      example: 'shopp123@gmail.com'
   *     otp:
   *      type: string
   *      description: OTP from ShopP Email
   *      example: '123456'
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
        name: 'otp',
        type: String,
        validator: (propName: string, value: string) => {
          const otpRegExp: RegExp = /^[0-9]{6}$/;
          if (!otpRegExp.test(value)) return `${propName} must be valid OTP`;
          return null;
        },
      },
    ],
  })
  static async verifyEmail(req: Request, res: Response) {
    const data = req.body;
    const user = await UserModel.getOneByEmail(
      String(data.email).toLowerCase()
    );
    if (user === false)
      return res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ message: 'Invalid email' });
    else {
      const result = await AuthModel.verifyOtp(
        user.id,
        data.otp,
        OtpEnum.VERIFICATION
      );
      return res
        .status(result.getCode())
        .send({ message: result.getMessage() });
    }
  }

  /**
   * @swagger
   * components:
   *  schemas:
   *   ResetPasswordRequest:
   *    type: object
   *    properties:
   *     email:
   *      type: string
   *      description: email of the user
   *      example: 'shopp123@gmail.com'
   *     otp:
   *      type: string
   *      description: OTP from ShopP Email
   *      example: '123456'
   *     password:
   *      type: string
   *      description: new password of the user
   *      example: 'abcABfsdfC213&'
   *     confirmPassword:
   *      type: string
   *      description: confirm new password of the user
   *      example: 'abcABfsdfC213&'
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
        name: 'otp',
        type: String,
        validator: (propName: string, value: string) => {
          const otpRegExp: RegExp = /^[0-9]{6}$/;
          if (!otpRegExp.test(value)) return `${propName} must be valid OTP`;
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
    ],
  })
  static async resetPassword(req: Request, res: Response) {
    const data = req.body;
    if (data.password !== data.confirmPassword)
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ message: 'Wrong confirm password' });

    const user = await UserModel.getOneByEmail(
      String(data.email).toLowerCase()
    );
    if (!user)
      res.status(HttpStatusCode.BAD_REQUEST).send({ message: 'Wrong email' });
    else {
      const result = await AuthModel.verifyOtp(
        user.id,
        data.otp,
        OtpEnum.FORGET
      );
      if (result.getCode() != HttpStatusCode.OK)
        res.status(result.getCode()).send({ message: result.getMessage() });
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
    if (token == undefined)
      return res
        .status(HttpStatusCode.UNAUTHORIZATION)
        .send({ message: 'Authorized Required' });
    let jwtPayload;
    token = token?.replace('Bearer ', '');
    //Try to validate the token and get data
    try {
      jwtPayload = <any>jwt.verify(token, config.ACCESS_TOKEN_SECRET);
      const user: User | false = await UserModel.getOneById(jwtPayload.userId);
      if (user === false) {
        return res.status(HttpStatusCode.UNAUTHORIZATION).send({
          message: 'Unauthorized: Access is denied due to invalid credentials',
        });
      } else res.locals.user = user;
    } catch (error) {
      //If token is not valid, respond with 401 (unauthorized)
      return res
        .status(HttpStatusCode.UNAUTHORIZATION)
        .send({ message: 'Not Authorized' });
    }
    //Call the next middleware or controller
    return next();
  }

  static async refreshToken(req: Request, res: Response) {
    //Get the jwt token from the cookies
    if (req.cookies?.jwt) {
      const refreshToken = req.cookies.jwt;
      jwt.verify(
        refreshToken,
        config.REFRESH_TOKEN_SECRET,
        async (err: any, jwtPayload: any) => {
          if (err) {
            // Wrong Refresh Token
            return res
              .status(HttpStatusCode.UNAUTHORIZATION)
              .json({ message: 'Unauthorized Request' });
          } else {
            const user: User | false = await UserModel.getOneById(
              jwtPayload.userId
            );
            if (user === false) {
              return res.status(HttpStatusCode.UNAUTHORIZATION).send({
                message:
                  'Unauthorized: Access is denied due to invalid credentials',
              });
            }
            // Correct token, send a new access token
            const token = jwt.sign(
              {
                userId: user.id,
                email: user.email,
              },
              config.ACCESS_TOKEN_SECRET,
              {
                expiresIn: '1h',
              }
            );
            return res
              .status(HttpStatusCode.OK)
              .send({ message: 'Success', token: token });
          }
        }
      );
      return;
    } else {
      return res
        .status(HttpStatusCode.BAD_REQUEST)
        .json({ message: 'Invalid Request' });
    }
  }
}
export default AuthMiddleware;

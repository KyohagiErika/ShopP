import { ShopPDataSource } from '../data';
import { User } from '../entities/user';
import { UserOtp } from '../entities/userOtp';
import { HttpStatusCode, StatusEnum, OtpEnum } from '../utils/shopp.enum';
import jwt from 'jsonwebtoken';
import config from '../utils/shopp.config';
import Response from '../utils/response';

const userRepository = ShopPDataSource.getRepository(User);
const UserOtpRepository = ShopPDataSource.getRepository(UserOtp);

export default class AuthModel {
  static async loginWithEmailOrPhone(
    emailOrPhone: string,
    password: string,
    flag: boolean
  ) {
    //Get user from database
    var user: User | null = new User();
    if (flag == true) {
      user = await userRepository.findOne({
        where: {
          email: emailOrPhone,
          status: StatusEnum.ACTIVE,
        },
      });
    } else {
      user = await userRepository.findOne({
        where: {
          phone: emailOrPhone,
          status: StatusEnum.ACTIVE,
        },
      });
    }

    if (user !== null) {
      //Check if encrypted password match
      if (!user.checkIfUnencryptedPasswordIsValid(password)) {
        return new Response(HttpStatusCode.BAD_REQUEST, 'Wrong login password');
      }
      //Sign JWT, valid for 1 hour
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        config.JWT_SECRET,
        { expiresIn: '1h' }
      );
      return new Response(HttpStatusCode.OK, 'Login successfully', token);
    } else
      return new Response(
        HttpStatusCode.BAD_REQUEST,
        'Email or Phone is wrong!'
      );
  }

  static async changePassword(
    id: number,
    oldPassword: string,
    newPassword: string
  ) {
    //Get user from the database
    let user: User | null = await userRepository.findOne({
      where: {
        id: id,
        status: StatusEnum.ACTIVE,
      },
    });
    if (user !== null) {
      //Check if old password matchs
      if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
        return new Response(HttpStatusCode.BAD_REQUEST, 'Wrong password!');
      }
      //Validate the model (password lenght)
      user.password = newPassword;
      //Hash the new password and save
      user.hashPassword();
      userRepository.save(user);
      return new Response(HttpStatusCode.OK, 'Change password successfully!');
    } else
      return new Response(
        HttpStatusCode.UNAUTHORIZATION,
        'Unauthorized error, user not exist!'
      );
  }

  static async resetPassword(id: number, password: string) {
    //Get user from the database
    let user: User | null = await userRepository.findOne({
      where: {
        id: id,
        status: StatusEnum.ACTIVE,
      },
    });
    if (user !== null) {
      //Validate the model (password lenght)
      user.password = password;
      //Hash the new password and save
      user.hashPassword();
      userRepository.save(user);

      return new Response(HttpStatusCode.OK, 'Change password successfully!');
    } else
      return new Response(
        HttpStatusCode.UNAUTHORIZATION,
        'Unauthorized error, user not exist!'
      );
  }

  static async forgotPassword(email: string) {
    //Get user from the database
    let user: User | null = await userRepository.findOne({
      where: {
        email: email,
        status: StatusEnum.ACTIVE,
      },
    });
    if (user !== null) {
      //Send confirm code to user email

      userRepository.save(user);
      return new Response(HttpStatusCode.OK, '');
    } else
      return new Response(
        HttpStatusCode.UNAUTHORIZATION,
        'Unauthorized error, user not exist!'
      );
  }

  static async getUserOtp(userId: number, type: OtpEnum, otp: string) {
    //Get user otp from the database
    let userOtp: UserOtp | null = await UserOtpRepository.findOne({
      relations: {
        user: true,
      },
      where: {
        user: {
          id: userId,
        },
        type: type,
        otp: otp,
      },
    });
    if (userOtp !== null) {
      //Send confirm code to user email
      return new Response(HttpStatusCode.OK, 'OTP was right', userOtp);
    } else
      return new Response(HttpStatusCode.BAD_REQUEST, 'OTP was not right!');
  }

  static async postUserOtp(
    user: User,
    type: OtpEnum,
    otp: string,
    otpExpiration: Date
  ) {
    //Get user otp from the database
    await UserOtpRepository.save({
      user: user,
      type: type,
      otp: otp,
      otpExpiration: otpExpiration,
    });
  }

  static async deleteUserOtp(userId: number, type: OtpEnum, otp: string) {
    //Get user otp from the database
    let userOtp: UserOtp | null = await UserOtpRepository.findOne({
      relations: {
        user: true,
      },
      where: {
        user: {
          id: userId,
        },
        type: type,
        otp: otp,
      },
    });
    if (userOtp !== null) {
      //Send confirm code to user email
      UserOtpRepository.remove(userOtp);
      return new Response(
        HttpStatusCode.OK,
        'Delete OTP successfully',
        userOtp
      );
    } else
      return new Response(HttpStatusCode.BAD_REQUEST, 'OTP was not right!');
  }

  static async verifyOtp(userId: number, otp: string, type: OtpEnum) {
    //VERIFY GENERATED OTP
    let result = await AuthModel.getUserOtp(userId, type, otp);
    if (result.getCode() == HttpStatusCode.OK) {
      let existOtp: UserOtp = result.getData();
      const currentDate = new Date();
      if (existOtp.otpExpiration > currentDate) {
        return new Response(HttpStatusCode.OK, 'Verify OTP successfully!');
      }
      await AuthModel.deleteUserOtp(userId, type, otp);
      return new Response(HttpStatusCode.BAD_REQUEST, 'OTP was expired!');
    } else {
      return new Response(HttpStatusCode.BAD_REQUEST, 'OTP was not right!');
    }
  }
}

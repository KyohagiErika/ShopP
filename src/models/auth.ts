import { ShopPDataSource } from '../data';
import { User } from '../entities/user';
import { HttpStatusCode, StatusEnum } from '../utils/shopp.enum';
import jwt from 'jsonwebtoken';
import config from '../utils/shopp.config';
import Response from '../utils/response';

export default class AuthModel {
  static async loginWithEmail(email: string, password: string) {
    //Get user from database
    const userRepository = ShopPDataSource.getRepository(User);
    const user: User | null = await userRepository.findOne({
      where: {
        email: email,
        status: StatusEnum.ACTIVE,
      },
    });

    if (user !== null) {
      //Check if encrypted password match
      if (!user.checkIfUnencryptedPasswordIsValid(password)) {
        return new Response(
          HttpStatusCode.UNAUTHORIZATION,
          'Wrong login password'
        );
      }
      //Sign JWT, valid for 1 hour
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        config.JWT_SECRET,
        { expiresIn: '1h' }
      );
      return new Response(HttpStatusCode.OK, 'Login successfully', token);
    } else
      return new Response(HttpStatusCode.BAD_REQUEST, 'Wrong login email!');
  }

  static async changePassword(
    id: number,
    oldPassword: string,
    newPassword: string
  ) {
    //Get user from the database
    const userRepository = ShopPDataSource.getRepository(User);
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

  static async forgotPassword(
    email: string
  ) {
    //Get user from the database
    const userRepository = ShopPDataSource.getRepository(User);
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
}

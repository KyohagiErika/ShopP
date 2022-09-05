import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ShopPDataSource } from '../data';
import { validate } from 'class-validator';

import { User } from '../entities/user';
import config from '../utils/shopp.config';
import { ControllerService } from '../utils/decorators';

class AuthMiddleware {
  @ControllerService({
    deepWatch: false,
    query: [
      {
        name: 'hello',
      },
    ],
    body: [
      {
        name: 'test',
        type: Number,
        validator: (propertyName: string, value: number) => {
          if (value < 10) {
            return `${propertyName} must greater or equal to 10`;
          }
          return null;
        },
      },
    ],
  })
  static async test(req: Request, res: Response) {
    // throw new Error('test error');
    res.send({ message: 'Success!' });
    // res.send('asdasd');
  }

  static async login(req: Request, res: Response) {
    //Check if username and password are set
    let { email, password } = req.body;
    if (!(email && password)) {
      res.status(400).send();
    }

    //Get user from database
    const userRepository = ShopPDataSource.getRepository(User);
    let user: User | undefined;
    try {
      user = await userRepository.findOneOrFail({ where: { email: email } });
    } catch (error) {
      res.status(401).send();
    }

    if (user !== undefined) {
      //Check if encrypted password match
      if (!user.checkIfUnencryptedPasswordIsValid(password)) {
        res.status(401).send();
        return;
      }

      //Sing JWT, valid for 1 hour
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        config.JWT_SECRET,
        { expiresIn: '1h' }
      );

      //Send the jwt in the response
      res.send({ token: token });
    }
  }

  static async changePassword(req: Request, res: Response) {
    //Get ID from JWT
    const id = res.locals.jwtPayload.userId;

    //Get parameters from the body
    const { oldPassword, newPassword } = req.body;
    if (!(oldPassword && newPassword)) {
      res.status(400).send();
    }

    //Get user from the database
    const userRepository = ShopPDataSource.getRepository(User);
    let user: User | undefined;
    try {
      user = await userRepository.findOneOrFail(id);
    } catch (id) {
      res.status(401).send();
    }
    if (user !== undefined) {
      //Check if old password matchs
      if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
        res.status(401).send();
        return;
      }

      //Validate de model (password lenght)
      user.password = newPassword;
      const errors = await validate(user);
      if (errors.length > 0) {
        res.status(400).send(errors);
        return;
      }
      //Hash the new password and save
      user.hashPassword();
      userRepository.save(user);

      res.status(204).send();
    }
  }
}
export default AuthMiddleware;

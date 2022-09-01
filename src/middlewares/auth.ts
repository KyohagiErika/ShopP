import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ShopPDataSource } from "../data";
import { validate } from "class-validator";

import { User } from "../entities/user";
import config from "../utils/shopp.config";
import { ControllerService } from "../utils/decorators";
import { StatusEnum } from "../utils/shopp.enum";

class AuthMiddleware {

  @ControllerService()
  static async test(req: Request, res: Response) {
    //throw new Error('test error');
    res.send({ message: 'Success!' });
  }

  static async loginWithEmail (req: Request, res: Response) {
    //Check if username and password are set
    let { email,phone, password } = req.body;
    if (!email) {
      res.status(400).send({message: 'Empty email!'});
    }

    if (!password) {
      res.status(400).send({message: 'Empty password!'});
    }

    //Get user from database
    const userRepository = ShopPDataSource.getRepository(User);
    let user: User | undefined;
    try {
      user = await userRepository.findOneOrFail({ where: { 
        email: email,
        status: StatusEnum.ACTIVE
       } });
    } catch (error) {
      res.status(401).send({message: 'Wrong email'});
      return
    }

    if (user !== undefined) {
      //Check if encrypted password match
      if (!user.checkIfUnencryptedPasswordIsValid(password)) {
        res.status(401).send({message: 'Wrong password'});
        return
      }

      //Sign JWT, valid for 1 hour
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        config.JWT_SECRET,
        { expiresIn: "1h" }
      );

      //Send the jwt in the response
      res.send({'token' : token});
      res.setHeader("auth", token);
    }
  };

  static async changePassword (req: Request, res: Response) {
    //Get ID from JWT
    const id = res.locals.jwtPayload.userId;

    //Get parameters from the body
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword) {
      res.status(400).send({message: 'Empty old password!'});
    }

    if (!newPassword) {
      res.status(400).send({message: 'Empty new password!'});
    }

    //Get user from the database
    const userRepository = ShopPDataSource.getRepository(User);
    let user: User | undefined;
    try {
      user = await userRepository.findOneOrFail(id);
    } catch (err) {
      res.status(401).send({message: 'Unauthorized error!'});
    }
    if (user !== undefined) {
      //Check if old password matchs
      if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
        res.status(401).send({message: 'Wrong password!'});
        return;
      }

      //Validate de model (password lenght)
      user.password = newPassword;
      const errors = await validate(user);
      if (errors.length > 0) {
        res.status(400).send({'errors': errors});
        return;
      }
      //Hash the new password and save
      user.hashPassword();
      userRepository.save(user);

      res.status(204).send({message: "Change password successfully!"});
    }
  };
}
export default AuthMiddleware;

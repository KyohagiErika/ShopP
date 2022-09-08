import { Request, Response, NextFunction } from 'express';
import { ShopPDataSource } from '../data';

import { User } from '../entities/user';
import { RoleEnum } from '../utils/shopp.enum';
import { UserRole } from '../entities/userRole';

export const checkRole = (role: RoleEnum) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    //Get the user ID from previous midleware
    const id = res.locals.jwtPayload.userId;

    //Get user role from the database
    const userRepository = ShopPDataSource.getRepository(User);
    let user: User | undefined;
    try {
      user = await userRepository.findOneOrFail(id);
    } catch (id) {
      res.status(401).send({ message: 'unauthorized error!' });
    }
    if (user !== undefined) {
      //Check if array of authorized user roles includes the  role
      let userRole: UserRole | undefined;
      if (userRole !== undefined) {
        userRole.role = role;
        if (user.roles.indexOf(userRole) > -1) next();
        else res.status(401).send({ message: 'unauthorized error!' });
      }
    }
  };
};

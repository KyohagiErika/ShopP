import { Request, Response, NextFunction } from 'express';
import { User } from '../entities/user';
import { RoleEnum, HttpStatusCode } from '../utils/shopp.enum';

export const checkRole = (role: RoleEnum) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    //Get the user ID from previous midleware
    const user: User = res.locals.user;
    //Check if authorized user roles includes the role
    if(role === RoleEnum.CUSTOMER && user.customer !== null) next();
    else if (user.role.role >= role) next();
    else
      res
        .status(HttpStatusCode.UNAUTHORIZATION)
        .send({ message: 'Unauthorized: Access is denied!' });
  };
};

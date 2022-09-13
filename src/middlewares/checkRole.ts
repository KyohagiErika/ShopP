import { Request, Response, NextFunction } from 'express';
import { ShopPDataSource } from '../data';

import { User } from '../entities/user';
import { HttpStatusCode, RoleEnum, StatusEnum } from '../utils/shopp.enum';
import { UserRole } from '../entities/userRole';

export const checkRole = (role: RoleEnum) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    //Get the user ID from previous midleware
    const id = res.locals.jwtPayload.userId;

    //Get user role from the database
    const userRepository = ShopPDataSource.getRepository(User);
    let user: User | null = await userRepository.findOne({
      relations: {
        roles: true
      },
      select: {
        roles: {
          role: true,
        }
      },
      where: {
        id: id,
        status: StatusEnum.ACTIVE,
      }
    });
    if (user == null) {
      res
        .status(HttpStatusCode.UNAUTHORIZATION)
        .send({ message: 'Unauthorized error, user not exist!' });
    } else {
      // var flag = false;
      // //Check if array of authorized user roles includes the  role
      // user.roles.forEach(userRole => { if (userRole.role === role) { flag = true; return; } });

      if (user.roles.map(userRole => userRole.role).includes(role)) next();
      else
        res
          .status(HttpStatusCode.UNAUTHORIZATION)
          .send({ message: 'Unauthorized error, Role is invalid!' });
    }
  };
};

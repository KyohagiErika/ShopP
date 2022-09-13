import { Request, Response, NextFunction } from "express";
import { User } from "../entities/user";
import UserModel from "../models/user";
import { RoleEnum, HttpStatusCode } from "../utils/shopp.enum";

export const checkRole = (role: RoleEnum) =>{
    return async (req: Request, res: Response, next: NextFunction) => {
      //Get the user ID from previous midleware
      const id = res.locals.jwtPayload.userId;

      const user: User | false = await UserModel.getOneById(id);
      if (user === false) {
        res
          .status(HttpStatusCode.UNAUTHORIZATION)
          .send({ message: 'Unauthorized error, User not exist!' });
      } else {
        //Check if array of authorized user roles includes the role
        if (user.roles.map(userRole => userRole.role).includes(role)) next();
        else
          res
            .status(HttpStatusCode.UNAUTHORIZATION)
            .send({ message: 'Unauthorized error, Role is invalid!' });
      }
    }
  }
import { validate } from "class-validator";
import { ShopPDataSource } from "../data";
import { User } from "../entities/user";
import { UserRole } from "../entities/userRole";
import { StatusEnum, RoleEnum } from "../utils/shopp.enum";

export default class UserModel {
  static async listAll() {
    const userRepository = ShopPDataSource.getRepository(User);
    const users = await userRepository.find({
      relations: {
        roles: true,
      },
      select: {
        id: true,
        email: true,
        phone: true,
        roles: {
          role: true
        }
      },//We dont want to send the passwords on response 
      where: {
        status: StatusEnum.ACTIVE,
      },
    });
    return users && users.length > 0 ? users : false;
  }

  static async getOneById(userId: number) {
    //Get the user from database
    const userRepository = ShopPDataSource.getRepository(User);
    try {
      const user = await userRepository.findOneOrFail({
        select: {
          id: true,
          email: true,
          phone: true,
          roles: {
            role: true
          }
        }, //We dont want to send the password on response
        where: {
          id: userId,
          status: StatusEnum.ACTIVE,
        },
      });
      return user ? user : false;
    } catch (error) {
      return { "error": error };
    };
  }

  static async postNew(
    email: string,
    phone: string,
    password: string,
    role: RoleEnum
  ) {
    //Get parameters from the body
    let user = new User();
    user.email = email;
    user.phone = phone;
    user.password = password;
    let userRole = new UserRole();
    userRole.role = role;
    userRole.user = user;

    //Validade if the parameters are ok
    const errorsUser = await validate(user);
    if (errorsUser.length > 0) {
      //res.status(400).send(errors);
      return errorsUser;
    }

    const errorUserRole = await validate(userRole);
    if (errorUserRole.length > 0) {
      //res.status(400).send(errors);
      return errorsUser;
    }

    //Hash the password, to securely store on DB
    user.hashPassword();

    //Try to save. If fails, the username is already in use
    const userRepository = ShopPDataSource.getRepository(User);
    const userRoleRepository = ShopPDataSource.getRepository(UserRole);
    try {
      await userRepository.save(user);
      await userRoleRepository.save(userRole);
    } catch (e) {
      return { "e": e };
    }
    //If all ok, send 201 response
    //res.status(201).send("User created");
    return user;
  }

  static async edit(id: number, email: string, phone: string) {
    //Try to find user on database
    const userRepository = ShopPDataSource.getRepository(User);
      try {
        const user : User | null = await userRepository.findOne({
          where: {
            id: id,
            status: StatusEnum.ACTIVE
          }
        });
        if (user !== null) {
          //Validate the new values on model
          user.email = email;
          user.phone = phone;
          const errors = await validate(user);
          if (errors.length > 0) {
            //res.status(400).send(errors);
            return {"errors" : errors};
          }

          //Try to safe, if fails, that means username already in use
          try {
            await userRepository.save(user);
            return true;
          } catch (e) {
            return {"e" : e};
          }
        } 
      return {"error": "Wrong id"};
        //After all send a 204 (no content, but accepted) response
        //res.status(204).send();
        
      } catch (error) {
        //If not found, send a 404 response
        //res.status(404).send("User not found");
        return {"error" : error};
    };
  }

  static async delete(userId: number) {
    const userRepository = ShopPDataSource.getRepository(User);
      try {
        const user : User | null = await userRepository.findOne({
          where: {
            id: userId,
            status: StatusEnum.ACTIVE
          }
        });
        if (user !== null) {
          //Validate the new values on model
          user.status = StatusEnum.INACTIVE;
          const errors = await validate(user);
          if (errors.length > 0) {
            //res.status(400).send(errors);
            return {"errors" : errors};
          }

          //Try to safe, if fails, that means username already in use
          try {
            await userRepository.save(user);
            return true;
          } catch (e) {
            return {"e" : e};
          }
        } 
      return {"error": "Unavailabe user"};
        //After all send a 204 (no content, but accepted) response
        //res.status(204).send();
        
      } catch (error) {
        //If not found, send a 404 response
        //res.status(404).send("User not found");
        return {"error" : error};
    };
    };
  };


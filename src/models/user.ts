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
        roles: true
      },
      select: {
        id: true,
        email: true,
        phone: true,
        status: true,
        createdAt: true,
        roles: true
      }//We dont want to send the passwords on response 
    });
    return users && (users.length > 0) ? users : false;
  };

  static async getOneById(id: number) {
    //Get the user from database
    const userRepository = ShopPDataSource.getRepository(User);
    try {
      const user = await userRepository.findOneOrFail({
        select: {
          id: true,
          email: true,
          phone: true,
          status: true,
          createdAt: true,
          roles: true
        }, //We dont want to send the password on response
        where: {
          id: id
        }
      });
      return user ? user : false;
    } catch (error) {
      return error;
    };
  }

  static async postNew(email: string, phone: string, password: string, role: RoleEnum) {
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

    const errorUserRole = await validate(userRole)
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
      return e;
    }
    //If all ok, send 201 response
    //res.status(201).send("User created");
    return user;
  };

  static async edit(id: number, email: string, phone: string) {
    //Try to find user on database
    const userRepository = ShopPDataSource.getRepository(User);
    let user: User | undefined | null;
    if (user !== undefined && user !== null) {
      try {
        user = await userRepository.findOne({ 
          where: {
            id: id,
            status: StatusEnum.ACTIVE
          } });
        if (user) {
          //Validate the new values on model
          user.email = email;
          user.phone = phone;
          const errors = await validate(user);
          if (errors.length > 0) {
            //res.status(400).send(errors);
            return errors;
          }

          //Try to safe, if fails, that means username already in use
          try {
            await userRepository.save(user);
          } catch (e) {
            return e;
          }
        }
        //After all send a 204 (no content, but accepted) response
        //res.status(204).send();
        return true;
      } catch (error) {
        //If not found, send a 404 response
        //res.status(404).send("User not found");
        return error;
      }
    };
  }

  static async delete(id: number) {
    const userRepository = ShopPDataSource.getRepository(User);
    let user: User | null | undefined;
    if (user !== null && user !== undefined) {
      try {
        user = await userRepository.findOne({ 
          where: {
            id: id,
            status: StatusEnum.ACTIVE
          } 
        });
        if(user !== null) {
          user.status = StatusEnum.INACTIVE;

          const errors = await validate(user);
          if(errors.length > 0) return errors;
          return true;
        } else return false;
        
      } catch (error) {
        //res.status(404).send("User not found");
        return error;
      }
      //After all send a 204 (no content, but accepted) response
      //res.status(204).send();     
    }
  };
};


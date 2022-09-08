import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../utils/shopp.config';
import { HttpStatusCode } from '../utils/shopp.enum';

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
  //Get the jwt token from the head
  const token = <string>req.headers['auth'];
  let jwtPayload;

  //Try to validate the token and get data
  try {
    jwtPayload = <any>jwt.verify(token, config.JWT_SECRET);
    res.locals.jwtPayload = jwtPayload;
  } catch (error) {
    //If token is not valid, respond with 401 (unauthorized)
    res.status(HttpStatusCode.UNAUTHORIZATION).send({message: 'Unauthorized error, token is invalid!'});
    return;
  }

  //The token is valid for 1 hour
  //We want to send a new token on every request
  const { userId, userEmail } = jwtPayload;
  const newToken = jwt.sign({ userId, userEmail }, config.JWT_SECRET, {
    expiresIn: '1h',
  });
  res.setHeader("auth", newToken);

  //Call the next middleware or controller
  next();
};

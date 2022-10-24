import { Router } from 'express';
import AuthMiddleware from '../middlewares/auth';
import { checkRole } from '../middlewares/checkRole';
import { RoleEnum } from '../utils/shopp.enum';

const router = Router();

/**
 * @swagger
 * /auth/login:
 *  post:
 *   tags:
 *    - Auth
 *   summary: Login to ShopP
 *   description: Login to ShopP
 *   parameters:
 *    - in: body
 *      name: body
 *      required: true
 *      description: Login
 *      schema:
 *       $ref: '#/definitions/LoginRequest'
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/definitions/LoginRequest'
 *   responses:
 *    200:
 *     description: Success
 *    404:
 *     description: Bad Request
 */
router.post('/login', AuthMiddleware.loginWithEmailOrPhone);

//Change my password
router.post(
  '/change-password',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.CUSTOMER)],
  AuthMiddleware.changePassword
);

//Forgot password route
router.post('/forgot-password', AuthMiddleware.forgotPassword);

//Reset password route
router.post('/reset-password', AuthMiddleware.resetPassword);

//Verify OTP route
router.post('/verify-otp', AuthMiddleware.verifyForgotPassword);

export default router;

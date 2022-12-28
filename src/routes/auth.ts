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
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/LoginRequest'
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/responses/LoginResponse'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 */
router.post('/login', AuthMiddleware.loginWithEmailOrPhone);

/**
 * @swagger
 * /auth/refresh:
 *  get:
 *   tags:
 *    - Auth
 *   summary: Get Refresh Token
 *   description: Get Refresh Token
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         token:
 *          type: string
 *          description: Access token
 *         message:
 *          type: string
 *          description: Message
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 *    401:
 *     $ref: '#/components/responses/401Unauthorized'
 */
router.get('/refresh', AuthMiddleware.refreshToken);

/**
 * @swagger
 * /auth/change-password:
 *  post:
 *   tags:
 *    - Auth
 *   security:
 *    - bearerAuth: []
 *   summary: Change user password
 *   description: Change user password
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/ChangePasswordRequest'
 *   responses:
 *    200:
 *     $ref: '#/components/responses/200OK'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 *    401:
 *     $ref: '#/components/responses/401Unauthorized'
 */
router.post(
  '/change-password',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.CUSTOMER)],
  AuthMiddleware.changePassword
);

/**
 * @swagger
 * /auth/forgot-password:
 *  post:
 *   tags:
 *    - Auth
 *   summary: Send otp to get forgot password
 *   description: Send otp to get forgot password
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        email:
 *         type: string
 *         description: email of the user
 *         example: 'sdferetgt@gmail.com'
 *   responses:
 *    200:
 *     $ref: '#/components/responses/200OK'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 *    520:
 *     $ref: '#/components/responses/520UnknownError'
 */
router.post('/forgot-password', AuthMiddleware.forgotPassword);

/**
 * @swagger
 * /auth/reset-password:
 *  post:
 *   tags:
 *    - Auth
 *   summary: Reset password
 *   description: Reset password
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/ResetPasswordRequest'
 *   responses:
 *    200:
 *     $ref: '#/components/responses/200OK'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 *    401:
 *     $ref: '#/components/responses/401Unauthorized'
 */
router.post('/reset-password', AuthMiddleware.resetPassword);

/**
 * @swagger
 * /auth/send-otp/verify-email:
 *  post:
 *   tags:
 *    - Auth
 *   summary: Send otp to verify email
 *   description: Send otp to get verify email
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        email:
 *         type: string
 *         description: email of the user
 *         example: 'sdferetgt@gmail.com'
 *   responses:
 *    200:
 *     $ref: '#/components/responses/200OK'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 *    520:
 *     $ref: '#/components/responses/520UnknownError'
 */
router.post(
  '/send-otp/verify-email',
  AuthMiddleware.sendGmailForVerifyingEmail
);

/**
 * @swagger
 * /auth/verify-email:
 *  post:
 *   tags:
 *    - Auth
 *   summary: Verify email
 *   description: Verify email
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/VerifyEmailRequest'
 *   responses:
 *    200:
 *     $ref: '#/components/responses/200OK'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 */
router.post('/verify-email', AuthMiddleware.verifyEmail);

export default router;

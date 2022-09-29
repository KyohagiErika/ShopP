import { Router } from 'express';
import AuthMiddleware from '../middlewares/auth';
import { checkRole } from '../middlewares/checkRole';
import { RoleEnum } from '../utils/shopp.enum';

const router = Router();
//Login route
router.post('/login', AuthMiddleware.loginWithEmailOrPhone);

//Logout route
router.get('/logout', 
[AuthMiddleware.checkJwt, checkRole(RoleEnum.CUSTOMER)], 
AuthMiddleware.logout
);

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

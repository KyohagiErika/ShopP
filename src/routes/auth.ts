import { Router } from "express";
import AuthMiddleware from "../middlewares/auth";
import { checkJwt } from "../middlewares/checkJwt";

const router = Router();
//Login route
router.post("/login", AuthMiddleware.loginWithEmail);

//Change my password
router.post("/change-password", [checkJwt], AuthMiddleware.changePassword);

router.post('/test', AuthMiddleware.test);

export default router;

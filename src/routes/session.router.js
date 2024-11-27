
import { Router } from "express";
import { userDao } from "../dao/user.dao.js"
import { authorization } from "../middlewares/authorization.middleware.js"
import { checkEmail } from "../middlewares/checkEmail.middleware.js";
import { createHash, isValidPassword } from "../utils/hashPassword.js";
import { validateEmailFormat } from "../middlewares/validateEmail.middleware.js"; 
import { validatePassword } from "../middlewares/validatePassword.middleware.js"; 
import passport from "passport";
import { createToken, verifyToken } from "../utils/jwt.js";
import { passportCall } from "../middlewares/passport.middleware.js";
import { SessionController } from "../controllers/session.controller.js";


const sessionController = new SessionController()
const router = Router()

router.post("/register", validateEmailFormat(), checkEmail(), validatePassword(), passportCall("register"), sessionController.register)

router.post("/login", passportCall("login"), sessionController.login)

router.get("/logout", sessionController.logout)

router.get("/current", passportCall("jwt"), authorization("user"), sessionController.current)

router.get("/admin", passportCall("jwt"), authorization("admin"), sessionController.admin);

export default router
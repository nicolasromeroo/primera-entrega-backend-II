
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

const router = Router()

router.post("/register", validateEmailFormat(), checkEmail(), validatePassword(), passportCall("register"), async (req, res) => {
    try {
        res.status(201).json({ status: "success", msg: "Usuario registrado" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "Error", msg: "Error interno del servidor" });
    }
})

router.post("/login", passportCall("login"), async (req, res) => {
    try {
        const token = createToken(req.user)

        res.cookie("token", token, { httpOnly: true })
        res.status(200).json({ status: "success", payload: req.user })

    } catch (error) {
        res.status(500).json({ status: "Error", msg: "Error interno del servidor" });
    }
})

router.get("/logout", async (req, res) => {
    try {
        req.session.destroy()
        res.status(200).json({ status: "succes", msg: "session cerrada" })
    } catch (error) {
        res.status(500).json({ status: "Error", msg: "Error interno del servidor" });
    }
})

router.get("/current", passportCall("jwt"), authorization("user"), async (req, res) => {
    try {
        const user = await userDao.getById(req.user.id)
        res.status(200).json({ status: "success", payload: user })
    } catch (error) {
        res.status(500).json({ status: "Error", msg: "Error interno del servidor" });
    }
})

router.get("/admin", passportCall("jwt"), authorization("admin"), async (req, res) => {
    res.status(200).json({ status: "success", msg: "Bienvenido, administrador!" });
});

export default router
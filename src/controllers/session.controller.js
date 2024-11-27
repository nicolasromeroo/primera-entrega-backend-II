
export class SessionController {
    async register (req, res) {
        try {
            res.status(201).json({ status: "success", msg: "Usuario registrado" })
        } catch (error) {
            console.log(error);
            res.status(500).json({ status: "Error", msg: "Error interno del servidor" });
        }
    }

    async login (req, res) {
        try {
            const token = createToken(req.user)
    
            res.cookie("token", token, { httpOnly: true })
            res.status(200).json({ status: "success", payload: req.user })
    
        } catch (error) {
            res.status(500).json({ status: "Error", msg: "Error interno del servidor" });
        }
    }

    async logout (req, res) {
        try {
            req.session.destroy()
            res.status(200).json({ status: "succes", msg: "session cerrada" })
        } catch (error) {
            res.status(500).json({ status: "Error", msg: "Error interno del servidor" });
        }
    }

    async current (req, res) {
        try {
            const user = await userDao.getById(req.user.id)
            res.status(200).json({ status: "success", payload: user })
        } catch (error) {
            res.status(500).json({ status: "Error", msg: "Error interno del servidor" });
        }
    }

    async admin (req, res) {
        res.status(200).json({ status: "success", msg: "Bienvenido, administrador!" });
    }
}
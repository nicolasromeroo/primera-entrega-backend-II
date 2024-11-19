
import passport from "passport"
import local from "passport-local"
import jwt from "passport-jwt"
import { cartDao } from "../dao/cart.dao.js"
import { userDao } from "../dao/user.dao.js"
import { createHash, isValidPassword } from "../utils/hashPassword.js"
import { cookieExtractor } from "../utils/cookieExctractor.js"
import { createToken } from "../utils/jwt.js"

const LocalStrategy = local.Strategy
const JWTStrategy = jwt.Strategy
const ExtractJwt = jwt.ExtractJwt

export const initializePassport = () => {
    passport.use("register", new LocalStrategy({ passReqToCallback: true, usernameField: "email" }, async (req, username, password, done) => {
        try {
            const { first_name, last_name, age, role } = req.body

            const user = await userDao.getByEmail(username)

            if (user) return done(null, false, { message: "El usuario ya existe" }) // donde es equivalente a un next() en los middlewares

            const cart = await cartDao.create()

            const newUser = {
                first_name,
                last_name,
                age,
                email: username,
                password: createHash(password),
                role: role ? role : "user",
                cart: cart._id
            }

            const userRegister = await userDao.create(newUser)
            return done(null, userRegister)

        } catch (error) {
            return done(error)
        }
    }
    )
    )

    passport.use("login", new LocalStrategy({ passReqToCallback: true, usernameField: "email" }, async (username, password, done) => {
        try {
            const user = await userDao.getByEmail(username)
            if (!user || !isValidPassword(password, user.password)) {
                return done(null, false, { message: "Email o contra no valido" })
            }
            done(null, user)
        } catch (error) {
            done(error)
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await userDao.getById(id)
            done(null, user)
        } catch (error) {
            done(error)
        }
    })

    passport.use(
        "jwt",
        new JWTStrategy(
            {
                jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
                secretOrKey: "ClaveSecreta"
            },
            async (jwt_payload, done) => {
                try {
                    return done(null, jwt_payload)
                } catch (error) {
                    return done(error)
                }
            }
        ))
}
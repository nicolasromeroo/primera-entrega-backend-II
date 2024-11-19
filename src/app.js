import express from "express"
import routes from "./routes/index.js"
import __dirname from "./dirname.js"
import { connectMongoDB } from "./config/mongoDB.config.js"
import session from "express-session"
import { initializePassport } from "./config/passport.config.js"

const app = express()

connectMongoDB()
initializePassport()

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

app.use("/api", routes);

const httpServer = app.listen(8080, () => {
  console.log("Servidor escuchando en el puerto 8080");
});

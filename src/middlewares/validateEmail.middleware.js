import { request, response } from "express";
import emailValidator from "email-validator"; 

export const validateEmailFormat = (req = request, res = response, next) => {
  const { email } = req.body;
  if (!emailValidator.validate(email)) {
    return res.status(400).json({ status: "error", msg: "Formato de email inválido." });
  }
  next();
};
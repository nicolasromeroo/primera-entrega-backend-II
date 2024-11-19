
import bcrypt from "bcrypt";

export const createHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

export const isValidPassword = (password, userPassword) => {
  if (!password || !userPassword) {
    throw new Error("Both password and hashed password are required.");
  }
  return bcrypt.compareSync(password, userPassword);
};
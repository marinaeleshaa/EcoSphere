import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";


export const hashPassword = async (password : string) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (password : string, hashedPassword : string) => {
  return bcrypt.compare(password, hashedPassword);
};


export const generateToken = (payload : object) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN || '7d'});
}

export const verifyToken = (token : string) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw err;
  }
};
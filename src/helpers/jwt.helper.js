import jwt from "jsonwebtoken";

// Función para generar un token JWT

export const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// Función para verificar un token JWT

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
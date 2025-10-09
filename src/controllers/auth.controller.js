import { json, Sequelize } from "sequelize";
import User from "../models/user.model.js";
import { sequelize } from "../config/database.js";
import Profile from "../models/profile.model.js";
import { generateToken } from "../helpers/jwt.helper.js";
import { hashPassword } from "../helpers/bcrypt.helper.js";

import { validationResult } from "express-validator";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secreto";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refresh_secreto";

// Registro
export const register = async (req, res) => {
  // Validar errores de express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array().map(e => e.msg) });
  }

  const t = await sequelize.transaction();
  try {
    const { username, email, password, role, name, lastname } = req.body;

    const hashed = await hashPassword(password);
    // Crea el usuario
    const user = await User.create({ username, email, password: hashed, role, name, lastname }, { transaction: t });
    // Crea el perfil con nombre y apellido, los demás campos en blanco
    await Profile.create({
      name: name,
      lastname: lastname,
      user_id: user.id,
      // Otros campos en blanco o null según tu modelo
    }, { transaction: t });

    await t.commit();
    res.status(201).json({ message: "Usuario registrado correctamente", user });
  } catch (error) {
    await t.rollback();
    // Mostrar error de Sequelize si es de validación
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({ errors: error.errors.map(e => e.message) });
    }
    res.status(500).json({ message: "Error al registrar usuario", error });
  }
};

// Login
export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(400).json({ error: "Usuario no encontrado" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ error: "Contraseña incorrecta" });

  const accessToken = jwt.sign(
    { id: user.id, role: user.role },
    JWT_SECRET,
    { expiresIn: "15m" }
  );
  const refreshToken = jwt.sign(
    { id: user.id, role: user.role },
    JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  user.refreshToken = refreshToken;
  await user.save();

  res.json({ accessToken, refreshToken });
};

// Refresh token
export const refresh = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ error: "Refresh token requerido" });

  try {
    const user = await User.findOne({ where: { refreshToken } });
    if (!user) return res.status(403).json({ error: "Refresh token inválido" });

    jwt.verify(refreshToken, JWT_REFRESH_SECRET);

    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.json({ accessToken });
  } catch {
    res.status(403).json({ error: "Refresh token inválido" });
  }
};

// Logout
export const logout = async (req, res) => {
  const { refreshToken } = req.body;
  const user = await User.findOne({ where: { refreshToken } });
  if (user) {
    user.refreshToken = null;
    await user.save();
  }
  res.json({ message: "Logout exitoso" });
};
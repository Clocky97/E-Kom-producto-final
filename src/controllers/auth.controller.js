import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const JWT_SECRET = process.env.JWT_SECRET || "secreto";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refresh_secreto";

// Registro
export const register = async (req, res) => {
  console.log("NO VEO UN CHOTO");
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ username, email, password: hashedPassword });
    res.status(201).json({ message: "Usuario registrado" });
  } catch (err) {
    res.status(400).json({ error: "No se pudo registrar el usuario" });
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
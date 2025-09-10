import User from "../models/user.model.js";
import { hashPassword, comparePassword } from "../helpers/bcrypt.helper.js";
import { generateToken } from "../helpers/jwt.helper.js";

// Registro

export const register = async (req, res) => {
  const transaction = sequelize.transaction();
  try {
    const { username, email, password, role, name, lastname } = req.body;

    const hashed = await hashPassword(password);
    const user = await User.create({ username, email, password: hashed, role },
        {transaction});
    await Profile.create({
            name: name,
            lastname: lastname,
            user_id: user.id
        },
        {transaction});

        (await transaction).commit();
    res.status(201).json({ message: "Usuario registrado correctamente", user });
  } catch (error) {
    res.status(500).json({ message: "Error al registrar usuario", error });
    (await transaction).rollback();
  }
};

// Login

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }
    const valid = await comparePassword(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }
    const token = generateToken({ id: user.id, role: user.role });
    console.log(token);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ message: "Login exitoso" });
  } catch (error) {
    res.status(500).json({ message: "Error al iniciar sesión", error });
  }
};

// Logout

export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Logout exitoso" });
  } catch (error) {
    res.status(500).json({ message: "Error al cerrar sesión", error });
  }
};
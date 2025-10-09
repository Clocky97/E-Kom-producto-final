
import { json, Sequelize } from "sequelize";
import User from "../models/user.model.js";
import { sequelize } from "../config/database.js";
import Profile from "../models/profile.model.js";
import { generateToken } from "../helpers/jwt.helper.js";
import { hashPassword } from "../helpers/bcrypt.helper.js";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


const JWT_SECRET = process.env.JWT_SECRET || "secreto";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refresh_secreto";

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
    res.status(500).json({ message: "Error al registrar usuario" +  error });
    (await transaction).rollback();
  }
};


export const login = async (req,res) => {
    const {email, password} = req.body;
    try {
        const user = await User.findOne( {
            where: { email: email, password: password},
            include: {
                model: Profile,
                as: "profile",
                attributes: ["name", "lastname"]
            }
        });
        if(!user) {
            res.status(400).json({ message: "credenciales invalidas"})
        };

        const token = generateToken({ id: user.id, role: user.role });
            console.log(token);
            res.cookie("token", token, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "strict",
              maxAge: 24 * 60 * 60 * 1000,
            });
        return res.status(200).json({
            msg: "Logueado correctamente"
        })

    } catch (error) {
        
    }
};

export const logout = async(req,res) => {
    try {
        res.clearCookie("token");
        res.status(200).json({
            msg: "Logout exitoso"
        })
    } catch (error) {
         res.status(500).json({error})
    }

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


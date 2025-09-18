import { json, Sequelize } from "sequelize";
import User from "../models/user.model.js";
import { sequelize } from "../config/database.js";
import Profile from "../models/profile.model.js";
import { generateToken } from "../helpers/jwt.helper.js";
import { hashPassword } from "../helpers/bcrypt.helper.js";


export const register = async (req,res) => {
    const { username, email, password, name, lastname} = req.body;
    const transaction = sequelize.transaction();
    try {
        const hashed = await hashPassword(password);
        const user = await User.create({
            username: username,
            email: email,
            password: hashed
        },
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
};
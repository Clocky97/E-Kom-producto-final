import { Profile } from "../models/relations.index.js";
import { User } from "../models/relations.index.js";

// Obtener todos los perfiles
export const getAllProfiles = async (req, res) => {
    try {
        const profiles = await Profile.findAll({
            include: [{ model: User, as: "user" }]
        });
        res.json(profiles);
    } catch (error) {
        res.status(500).json({ error: "Error fetching profiles: " + error.message });
    }
};

// Obtener un perfil por ID
export const getProfileById = async (req, res) => {
    try {
        const { id } = req.params;
        const profile = await Profile.findByPk(id, {
            include: [{ model: User, as: "user" }]
        });
        if (!profile) {
            return res.status(404).json({ error: "Profile not found" });
        }
        res.json(profile);
    } catch (error) {
        res.status(500).json({ error: "Error fetching profile: " + error.message });
    }
};

// Crear un perfil
export const createProfile = async (req, res) => {
    try {
        const profile = await Profile.create(req.body);
        res.status(201).json(profile);
    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            return res.status(400).json({ 
                error: error.errors.map(e => e.message) 
            });
        }
        res.status(500).json({ error: "Error creating profile: " + error.message });
    }
};

// Actualizar un perfil
export const updateProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const profile = await Profile.findByPk(id);
        if (!profile) {
            return res.status(404).json({ error: "Profile not found" });
        }
        await profile.update(req.body);
        res.json(profile);
    } catch (error) {
        res.status(500).json({ error: "Error updating profile: " + error.message });
    }
};

// Eliminar un perfil
export const deleteProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const profile = await Profile.findByPk(id);
        if (!profile) {
            return res.status(404).json({ error: "Profile not found" });
        }
        await profile.destroy();
        res.json({ message: "Profile deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting profile: " + error.message });
    }
};

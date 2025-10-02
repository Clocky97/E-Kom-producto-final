
import { PostModel } from "../models/post.model.js";

export const getAllPost = async (req, res) => {
    try {
        const posts = await PostModel.findAll();
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: "", error});
    }
};

export const getPostById = async (req, res) => {
    try {
        const user = await req.user;
        const post = await PostModel.findByPk(user.id);
        res.status(200).json(post)
    } catch (error) {;
        res.status(500).json({ message: "", error});
    }
};

export const createPost = async (req, res) => {
    try {
        const createPost = await PostModel.create(req.body);
        res.status(201).json(createPost);
        
    } catch (error) {
        res.status(500).json({ message: "", error});
    }
};

export const updatePost = async (req, res) => {
    try {
        const updatePost = await PostModel.update(req.body, {
            where: {id: req.params.id}
        })
        if(updatePost){
            const post = await PostModel.findByPk(req.params.id);
            res.status(200).json(post)
        }
    } catch (error) {
        res.status(500).json({ message: "", error});
    }
};

export const deletePost = async (req, res) => {
    try {
        const post = await PostModel.findByPk(req.params.id);
        post.destroy();
        res.status(200).json({msj: "Categoría eliminada"})
    } catch (error) {
        res.status(500).json({ message: "", error});
    }
};
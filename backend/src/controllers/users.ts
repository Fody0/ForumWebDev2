import {RequestHandler} from "express";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";

import UserModel from "../models/user";

export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
    try {
        // if(!req.session.userId){
        //     throw createHttpError(401, "User not authenticated");
        // }

        const user = await UserModel.findById(req.session.userId).select("+email").exec();

        res.status(200).json(user);
    }catch(e){
        next(e);
    }
}

interface SignUpBody {
    username?: string,
    email?: string,
    password?: string,
}

export const signUp: RequestHandler<unknown, unknown, SignUpBody, unknown> = async (req, res, next) => {
    const username = req.body.username;
    const email = req.body.email;
    const passwordRaw = req.body.password;

    try {
        if(!username || !email || !passwordRaw){
            throw createHttpError(400, "Parameters missing");
        }

        const existingUserName = await UserModel.findOne({username: username}).exec();

        if(existingUserName){
            throw createHttpError(409, "User already exists. Please choose different one");
        }

        const existingEmail = await UserModel.findOne({email: email}).exec();

        if(existingEmail){
            throw createHttpError(409, "A user with this email already exists. Please choose different one");
        }

        const passwordHashed = await bcrypt.hash(passwordRaw, 10);

        const newUser = await UserModel.create({
            username: username,
            email: email,
            password: passwordHashed,
        });

        req.session.userId = newUser._id;

        res.status(201).json(newUser);
    }catch(e){
        next(e);
    }
};

interface LoginBody {
    username?: string,
    password?: string
}

export const login: RequestHandler<unknown, unknown, LoginBody, unknown> = async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    try {
        if(!username || !password){
            throw createHttpError(400, "Username or password missing");
        }

        const user = await UserModel.findOne({username: username}).select("+password +email").exec();

        console.log(user);

        if(!user){
            throw createHttpError(401, "Invalid credentials");
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if(!passwordMatch){
            throw createHttpError(401, "Invalid credentials");
        }

        req.session.userId = user._id;
        res.status(201).json(user);
    }catch(e){
        next(e);
    }
}

export const logout: RequestHandler = async (req, res, next) => {
    req.session.destroy(error => {
        if(error) next(error);
        else res.sendStatus(200);
    });

}
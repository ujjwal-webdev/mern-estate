import { errorHandler } from "../utils/error.js";
import bcrypt from 'bcryptjs';
import User from "../models/user.model.js";

export const test = (req, res) => {
    res.send("Hello world");
}

export const updateUser = async (req, res, next) => {
    if(req.user.id !== req.params.id) {
        return next(errorHandler(401, "You can only update your own profile"));
    }
    try
    {
        if(req.body.password) {
            req.body.password = bcrypt.hashSync(req.body.password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set:{
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar
            }
        }, {new: true})

        const { password, ...rest } = updatedUser._doc;
        res.status(200).json(rest);
    }
    catch (err)
    {
        next(err)
    }
}

export const deleteUser = async (req, res, next) => {
    if(req.user.id !== req.params.id) {
        return next(errorHandler(401, "You can only delete your own profile"));
    }

    try{
        await User.findByIdAndDelete(req.params.id);
        res.clearCookie("access_token");
        res.status(200).json("User has been deleted")
    }
    catch (err)
    {
        next(err)
    }
}
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const errors_1 = require("../errors");
const User_mode_1 = require("../models/User.mode");
const user_service_1 = require("../services/user.service");
const validators_1 = require("../validators");
class UserController {
    async findAll(req, res, next) {
        try {
            const users = await user_service_1.userService.findAll();
            return res.json(users);
        }
        catch (e) {
            next(e);
        }
    }
    async create(req, res, next) {
        try {
            const createdUser = await user_service_1.userService.create(req.res.locals);
            return res.status(201).json(createdUser);
        }
        catch (e) {
            next(e);
        }
    }
    async findById(req, res, next) {
        try {
            const user = await user_service_1.userService.findById(req.params.id);
            return res.json(user);
        }
        catch (e) {
            next(e);
        }
    }
    async updateById(req, res, next) {
        try {
            const { id } = req.params;
            const { error, value } = validators_1.UserValidator.update.validate(req.body);
            if (error) {
                throw new errors_1.ApiError(error.message, 400);
            }
            const updatedUser = await User_mode_1.User.findOneAndUpdate({ _id: id }, { ...value }, { returnDocument: "after" });
            return res.status(200).json(updatedUser);
        }
        catch (e) {
            next(e);
        }
    }
    async deleteById(req, res, next) {
        try {
            const { id } = req.params;
            await User_mode_1.User.deleteOne({ _id: id });
            return res.sendStatus(200);
        }
        catch (e) {
            next(e);
        }
    }
}
exports.userController = new UserController();

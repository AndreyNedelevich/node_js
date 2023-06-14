"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const user_service_1 = require("../services/user.service");
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
    async findById(req, res, next) {
        try {
            const { userId } = req.params;
            const user = await user_service_1.userService.findById(userId);
            return res.json(user);
        }
        catch (e) {
            next(e);
        }
    }
    async updateById(req, res, next) {
        try {
            const { userId } = req.params;
            const updatedUser = await user_service_1.userService.updateById(userId, req.body);
            return res.status(200).json(updatedUser);
        }
        catch (e) {
            next(e);
        }
    }
    async deleteById(req, res, next) {
        try {
            const { userId } = req.params;
            await user_service_1.userService.deleteById(userId);
            return res.sendStatus(204);
        }
        catch (e) {
            next(e);
        }
    }
}
exports.userController = new UserController();

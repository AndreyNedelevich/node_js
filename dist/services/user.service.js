"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const errors_1 = require("../errors");
const User_mode_1 = require("../models/User.mode");
const user_repository_1 = require("../repositories/user.repository");
class UserService {
    async findAll() {
        return await User_mode_1.User.find();
    }
    async create(data) {
        return await user_repository_1.userRepository.create(data);
    }
    async findById(id) {
        return await this.getOneByIdOrThrow(id);
    }
    async updateById(userId, dto) {
        await this.getOneByIdOrThrow(userId);
        return await User_mode_1.User.findOneAndUpdate({ _id: userId }, { ...dto }, { returnDocument: "after" });
    }
    async deleteById(userId) {
        await this.getOneByIdOrThrow(userId);
        await User_mode_1.User.deleteOne({ _id: userId });
    }
    async getOneByIdOrThrow(userId) {
        const user = await User_mode_1.User.findById(userId);
        if (!user) {
            throw new errors_1.ApiError("User not found", 422);
        }
        return user;
    }
}
exports.userService = new UserService();

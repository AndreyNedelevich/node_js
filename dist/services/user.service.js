"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const errors_1 = require("../errors");
const User_mode_1 = require("../models/User.mode");
const user_repository_1 = require("../repositories/user.repository");
const s3_service_1 = require("./s3.service");
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
    async uploadAvatar(userId, avatar) {
        const user = await this.getOneByIdOrThrow(userId);
        if (user.avatar) {
            await s3_service_1.s3Service.deleteFile(user.avatar);
        }
        const pathToFile = await s3_service_1.s3Service.uploadFile(avatar, "user", userId);
        return await User_mode_1.User.findByIdAndUpdate(userId, { $set: { avatar: pathToFile } }, { new: true });
    }
    async deleteAvatar(userId) {
        const user = await this.getOneByIdOrThrow(userId);
        if (!user.avatar) {
            return user;
        }
        await s3_service_1.s3Service.deleteFile(user.avatar);
        return await User_mode_1.User.findByIdAndUpdate(userId, { $unset: { avatar: true } }, { new: true });
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

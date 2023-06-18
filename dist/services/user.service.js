"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const token_type_enum_1 = require("../enums/token-type.enum");
const errors_1 = require("../errors");
const ActionTokenModel_1 = require("../models/ActionTokenModel");
const User_mode_1 = require("../models/User.mode");
const user_repository_1 = require("../repositories/user.repository");
const token_service_1 = require("./token.service");
class UserService {
    async findAll() {
        return await User_mode_1.User.find();
    }
    async create(data) {
        return await user_repository_1.userRepository.create(data);
    }
    async findById(id) {
        return await this.getOneOrThrow(id);
    }
    async updateById(userId, dto) {
        await this.getOneOrThrow(userId);
        return await User_mode_1.User.findOneAndUpdate({ _id: userId }, { ...dto }, { returnDocument: "after" });
    }
    async deleteById(userId) {
        await this.getOneOrThrow(userId);
        await User_mode_1.User.deleteOne({ _id: userId });
    }
    async getOneOrThrow(field) {
        const user = await User_mode_1.User.findById(field);
        if (!user) {
            throw new errors_1.ApiError("User not found", 422);
        }
        return user;
    }
    async activate(activationLink) {
        const payloadActionToken = token_service_1.tokenService.checkToken(activationLink, token_type_enum_1.ETokenType.Activated);
        const user = await User_mode_1.User.findOne({ email: payloadActionToken.email });
        const actionTokenFromDB = await ActionTokenModel_1.ActionToken.findOne({
            email: payloadActionToken.email,
        });
        if (!payloadActionToken &&
            actionTokenFromDB.actionToken === activationLink) {
            throw new errors_1.ApiError("Неккоректная ссылка активации", 400);
        }
        return await User_mode_1.User.findOneAndUpdate({ _id: user._id }, { isActivated: true }, { returnDocument: "after" });
    }
}
exports.userService = new UserService();

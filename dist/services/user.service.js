"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const errors_1 = require("../errors");
const User_mode_1 = require("../models/User.mode");
const user_repository_1 = require("../repositories/user.repository");
class UserService {
    async findAll() {
        try {
            return await User_mode_1.User.find().select("-password");
        }
        catch (e) {
            throw new errors_1.ApiError(e.message, e.status);
        }
    }
    async create(data) {
        return await user_repository_1.userRepository.create(data);
    }
    async findById(id) {
        return await User_mode_1.User.findById(id);
    }
}
exports.userService = new UserService();

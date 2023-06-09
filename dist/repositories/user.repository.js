"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepository = void 0;
const User_mode_1 = require("../models/User.mode");
class UserRepository {
    async create(data) {
        return await User_mode_1.User.create(data);
    }
}
exports.userRepository = new UserRepository();

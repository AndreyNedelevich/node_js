"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const errors_1 = require("../errors");
const Token_model_1 = require("../models/Token.model");
const User_mode_1 = require("../models/User.mode");
const password_service_1 = require("./password.service");
const token_service_1 = require("./token.service");
class AuthService {
    async register(data) {
        try {
            const hashedPassword = await password_service_1.passwordService.hash(data.password);
            await User_mode_1.User.create({ ...data, password: hashedPassword });
        }
        catch (e) {
            throw new errors_1.ApiError(e.message, e.status);
        }
    }
    async login(credentials, user) {
        try {
            const isMatched = await password_service_1.passwordService.compare(credentials.password, user.password);
            if (!isMatched) {
                throw new errors_1.ApiError("Invalid email or password", 401);
            }
            const tokensPair = await token_service_1.tokenService.generateTokenPair({
                _id: user._id,
            });
            await Token_model_1.Token.create({
                ...tokensPair,
                _userId: user._id,
            });
            return tokensPair;
        }
        catch (e) {
            throw new errors_1.ApiError(e.message, e.status);
        }
    }
}
exports.authService = new AuthService();

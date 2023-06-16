"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const email_enum_1 = require("../enums/email.enum");
const errors_1 = require("../errors");
const Token_model_1 = require("../models/Token.model");
const User_mode_1 = require("../models/User.mode");
const email_service_1 = require("./email.service");
const password_service_1 = require("./password.service");
const token_service_1 = require("./token.service");
class AuthService {
    async register(data) {
        try {
            const hashedPassword = await password_service_1.passwordService.hash(data.password);
            await User_mode_1.User.create({ ...data, password: hashedPassword });
            await email_service_1.emailService.sendMail(data.email, email_enum_1.EEmailActions.WELCOME, {
                name: data.name,
                url: "http://localhost:5541/activate-account/jwtToken",
            });
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
                name: user.name,
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

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const action_token_type_enum_1 = require("../enums/action-token-type.enum");
const email_enum_1 = require("../enums/email.enum");
const sms_enums_1 = require("../enums/sms.enums");
const user_status_enum_1 = require("../enums/user-status.enum");
const errors_1 = require("../errors");
const Action_model_1 = require("../models/Action.model");
const OldPassword_model_1 = require("../models/OldPassword.model");
const Token_model_1 = require("../models/Token.model");
const User_mode_1 = require("../models/User.mode");
const email_service_1 = require("./email.service");
const password_service_1 = require("./password.service");
const sms_service_1 = require("./sms.service");
const token_service_1 = require("./token.service");
class AuthService {
    async register(data) {
        try {
            const hashedPassword = await password_service_1.passwordService.hash(data.password);
            const user = await User_mode_1.User.create({ ...data, password: hashedPassword });
            const actionToken = token_service_1.tokenService.generateActionToken({ _id: user._id }, action_token_type_enum_1.EActionTokenTypes.Activate);
            await Promise.all([
                Action_model_1.Action.create({
                    actionToken,
                    tokenType: action_token_type_enum_1.EActionTokenTypes.Activate,
                    _userId: user._id,
                }),
                email_service_1.emailService.sendMail(data.email, email_enum_1.EEmailActions.WELCOME, {
                    name: data.name,
                    actionToken,
                }),
                sms_service_1.smsService.sendSms(data.phone, sms_enums_1.ESmsActions.WELCOME),
            ]);
        }
        catch (e) {
            throw new errors_1.ApiError(e.message, e.status);
        }
    }
    async activate(jwtPayload) {
        try {
            await Promise.all([
                User_mode_1.User.updateOne({ _id: jwtPayload._id }, { status: user_status_enum_1.EUserStatus.Active }),
                Action_model_1.Action.deleteMany({
                    _userId: jwtPayload._id,
                    tokenType: action_token_type_enum_1.EActionTokenTypes.Activate,
                }),
            ]);
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
    async refresh(oldTokensPair, tokenPayload) {
        try {
            const tokensPair = await token_service_1.tokenService.generateTokenPair(tokenPayload);
            await Promise.all([
                Token_model_1.Token.create({ _userId: tokenPayload._id, ...tokensPair }),
                Token_model_1.Token.deleteOne({ refreshToken: oldTokensPair.refreshToken }),
            ]);
            return tokensPair;
        }
        catch (e) {
            throw new errors_1.ApiError(e.message, e.status);
        }
    }
    async changePassword(dto, userId) {
        try {
            const [oldPasswords, user] = await Promise.all([
                OldPassword_model_1.OldPassword.find({ _userId: userId }).lean(),
                User_mode_1.User.findById(userId).select("password"),
            ]);
            const passwords = [...oldPasswords, { password: user.password }];
            await Promise.all(passwords.map(async ({ password: hash }) => {
                const isMatched = await password_service_1.passwordService.compare(dto.newPassword, hash);
                if (isMatched) {
                    throw new errors_1.ApiError("Wrong old password", 400);
                }
            }));
            const newHash = await password_service_1.passwordService.hash(dto.newPassword);
            await Promise.all([
                OldPassword_model_1.OldPassword.create({ password: user.password, _userId: userId }),
                User_mode_1.User.updateOne({ _id: userId }, { password: newHash }),
            ]);
        }
        catch (e) {
            throw new errors_1.ApiError(e.message, e.status);
        }
    }
    async forgotPassword(userId, email) {
        try {
            const actionToken = token_service_1.tokenService.generateActionToken({ _id: userId }, action_token_type_enum_1.EActionTokenTypes.Forgot);
            await Promise.all([
                Action_model_1.Action.create({
                    actionToken,
                    tokenType: action_token_type_enum_1.EActionTokenTypes.Forgot,
                    _userId: userId,
                }),
                email_service_1.emailService.sendMail(email, email_enum_1.EEmailActions.FORGOT_PASSWORD, {
                    actionToken,
                }),
            ]);
        }
        catch (e) {
            throw new errors_1.ApiError(e.message, e.status);
        }
    }
    async setForgotPassword(password, userId, actionToken) {
        try {
            const hashedPassword = await password_service_1.passwordService.hash(password);
            await Promise.all([
                User_mode_1.User.updateOne({ _id: userId }, { password: hashedPassword }),
                Action_model_1.Action.deleteOne({ actionToken }),
            ]);
        }
        catch (e) {
            throw new errors_1.ApiError(e.message, e.status);
        }
    }
}
exports.authService = new AuthService();

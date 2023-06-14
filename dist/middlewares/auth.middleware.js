"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const errors_1 = require("../errors");
const Token_model_1 = require("../models/Token.model");
const token_service_1 = require("../services/token.service");
class AuthMiddleware {
    async checkAccessToken(req, res, next) {
        try {
            const accessToken = req.get("Authorization");
            if (!accessToken) {
                throw new errors_1.ApiError("No token", 401);
            }
            const payload = token_service_1.tokenService.checkToken(accessToken);
            const entity = await Token_model_1.Token.findOne({ accessToken });
            if (!entity) {
                throw new errors_1.ApiError("Token not valid", 401);
            }
            req.res.locals.tokenPayload = payload;
            next();
        }
        catch (e) {
            next(e);
        }
    }
}
exports.authMiddleware = new AuthMiddleware();

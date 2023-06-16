"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const auth_service_1 = require("../services/auth.service");
class AuthController {
    async register(req, res, next) {
        try {
            await auth_service_1.authService.register(req.body);
            return res.sendStatus(201);
        }
        catch (e) {
            next(e);
        }
    }
    async login(req, res, next) {
        try {
            const tokensPair = await auth_service_1.authService.login(req.body, req.res.locals.user);
            return res.status(200).json({
                ...tokensPair,
            });
        }
        catch (e) {
            next(e);
        }
    }
    async changePassword(req, res, next) {
        try {
            const { _id: userId } = req.res.locals.tokenPayload;
            await auth_service_1.authService.changePassword(req.body, userId);
            return res.sendStatus(201);
        }
        catch (e) {
            next(e);
        }
    }
    async refresh(req, res, next) {
        try {
            const oldTokenPair = req.res.locals.oldTokenPair;
            const tokenPayload = req.res.locals.tokenPayload;
            const tokensPair = await auth_service_1.authService.refresh(oldTokenPair, tokenPayload);
            return res.status(200).json(tokensPair);
        }
        catch (e) {
            next(e);
        }
    }
}
exports.authController = new AuthController();

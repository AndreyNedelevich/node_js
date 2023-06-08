"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userMiddleware = void 0;
const errors_1 = require("../errors");
const validators_1 = require("../validators");
class UserMiddleware {
    isCreateValid(req, res, next) {
        try {
            const { error, value } = validators_1.UserValidator.create.validate(req.body);
            if (error) {
                throw new errors_1.ApiError(error.message, 400);
            }
            req.res.locals = value;
            next();
        }
        catch (e) {
            next(e);
        }
    }
}
exports.userMiddleware = new UserMiddleware();

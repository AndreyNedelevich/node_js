"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userMiddleware = void 0;
const errors_1 = require("../errors");
const User_mode_1 = require("../models/User.mode");
class UserMiddleware {
    findAndThrow(field) {
        return async (req, res, next) => {
            try {
                const user = await User_mode_1.User.findOne({ [field]: req.body[field] });
                if (user) {
                    throw new errors_1.ApiError("User with this email already exist", 409);
                }
                next();
            }
            catch (e) {
                next(e);
            }
        };
    }
    isUserExist(field) {
        return async (req, res, next) => {
            try {
                const user = await User_mode_1.User.findOne({ [field]: req.body[field] });
                if (!user) {
                    throw new errors_1.ApiError("User not found", 422);
                }
                res.locals.user = user;
                next();
            }
            catch (e) {
                next(e);
            }
        };
    }
}
exports.userMiddleware = new UserMiddleware();

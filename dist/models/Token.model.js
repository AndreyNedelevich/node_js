"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = void 0;
const mongoose_1 = require("mongoose");
const User_mode_1 = require("./User.mode");
const tokensSchema = new mongoose_1.Schema({
    accessToken: {
        type: String,
        required: true,
    },
    refreshToken: {
        type: String,
        required: true,
    },
    _userId: {
        type: mongoose_1.Types.ObjectId,
        required: true,
        ref: User_mode_1.User,
    },
});
exports.Token = (0, mongoose_1.model)("token", tokensSchema);

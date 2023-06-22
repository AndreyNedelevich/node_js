"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OldPassword = void 0;
const mongoose_1 = require("mongoose");
const User_mode_1 = require("./User.mode");
const oldPasswordSchema = new mongoose_1.Schema({
    password: {
        type: String,
        required: true,
    },
    _userId: {
        type: mongoose_1.Types.ObjectId,
        required: true,
        ref: User_mode_1.User,
    },
}, { versionKey: false, timestamps: true });
exports.OldPassword = (0, mongoose_1.model)("oldPassword", oldPasswordSchema);

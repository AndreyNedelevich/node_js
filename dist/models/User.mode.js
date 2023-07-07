"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const user_enum_1 = require("../enums/user.enum");
const user_status_enum_1 = require("../enums/user-status.enum");
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
    },
    age: {
        type: Number,
        min: [1, "Minimum value for age is 1"],
        max: [199, "Maximum value for age is 199"],
    },
    gender: {
        type: String,
        enum: user_enum_1.EGenders,
    },
    status: {
        type: String,
        default: user_status_enum_1.EUserStatus.Inactive,
        enum: user_status_enum_1.EUserStatus,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    avatar: {
        type: String,
        required: false,
    },
    phone: {
        type: String,
        trim: true,
        required: true,
    },
}, {
    versionKey: false,
    timestamps: true,
});
exports.User = (0, mongoose_1.model)("user", userSchema);

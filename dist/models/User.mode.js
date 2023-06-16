"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const user_enum_1 = require("../enums/user.enum");
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
    isActivated: {
        type: Boolean,
        default: false,
    },
}, {
    versionKey: false,
    timestamps: true,
});
exports.User = (0, mongoose_1.model)("user", userSchema);

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionToken = void 0;
const mongoose_1 = require("mongoose");
const User_mode_1 = require("./User.mode");
const actionTokenSchema = new mongoose_1.Schema({
    actionToken: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        ref: User_mode_1.User,
    },
});
exports.ActionToken = (0, mongoose_1.model)("actionToken", actionTokenSchema);

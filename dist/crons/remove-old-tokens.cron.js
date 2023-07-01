"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeOldTokens = void 0;
const cron_1 = require("cron");
const dayjs_1 = __importDefault(require("dayjs"));
const utc_1 = __importDefault(require("dayjs/plugin/utc"));
const Token_model_1 = require("../models/Token.model");
dayjs_1.default.extend(utc_1.default);
const tokensRemover = async () => {
    const previousMonth = (0, dayjs_1.default)().utc().subtract(30, "days");
    await Token_model_1.Token.deleteMany({
        createdAt: { $lte: previousMonth },
    });
};
exports.removeOldTokens = new cron_1.CronJob("* * * * * *", tokensRemover);

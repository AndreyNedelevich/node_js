"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allTemplates = void 0;
const email_enum_1 = require("../enums/email.enum");
exports.allTemplates = {
    [email_enum_1.EEmailActions.WELCOME]: {
        templateName: "register",
        subject: "Welcome to our powerful CRUD platform",
    },
    [email_enum_1.EEmailActions.FORGOT_PASSWORD]: {
        templateName: "forgot-password",
        subject: "WE CONTROL YOUR PASSWORD",
    },
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.smsService = void 0;
const twilio_1 = require("twilio");
const config_1 = require("../configs/config");
const sms_constants_1 = require("../constants/sms.constants");
class SmsService {
    constructor(client = new twilio_1.Twilio(config_1.configs.TWILIO_ACCOUNT_SID, config_1.configs.TWILIO_TOKEN)) {
        this.client = client;
    }
    async sendSms(phone, action) {
        try {
            const template = sms_constants_1.smsTemplates[action];
            await this.client.messages.create({
                body: template,
                messagingServiceSid: config_1.configs.TWILIO_SERVICE_SID,
                to: phone,
            });
        }
        catch (e) {
            console.error(e.message);
        }
    }
}
exports.smsService = new SmsService();

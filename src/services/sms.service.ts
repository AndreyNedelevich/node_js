import { Twilio } from "twilio";

import { configs } from "../configs/config";
import { smsTemplates } from "../constants/sms.constants";
import { ESmsActions } from "../enums/sms.enums";

class SmsService {
  constructor(
    //Внутри констуктора делаем приватную переменную client и возвращаем в нее екземпляр класса new Twilio с опцциями.
    //
    private client = new Twilio(
      configs.TWILIO_ACCOUNT_SID,
      configs.TWILIO_TOKEN
    )
  ) {}

  public async sendSms(phone: string, action: ESmsActions) {
    try {
      const template = smsTemplates[action];
      //ПРи помощи предачи в аргумент функции одно из полей Enum далее динамично при помощи [] отпределяем текст сообщения.
      await this.client.messages.create({
        //При необходимости с метода client.messages.create можно вернуть данные которые будут включать в себя разеую информацию об отправке смс.
        body: template,
        //текст смс сообщения
        messagingServiceSid: configs.TWILIO_SERVICE_SID,
        //От котого мы отправляем сообщения. Мы используем вариант через сервис.
        //Если бы использовали вариант через телефон то здесь был бы указан from  далее  телефон который мы преобрели на Tvilio.
        to: phone,
        // кому будем отпралять.
      });
    } catch (e) {
      console.error(e.message);
    }
  }
}

export const smsService = new SmsService();

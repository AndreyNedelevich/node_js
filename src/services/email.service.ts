import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
//Импорируем метод hbs с nodemailer-express-handlebars"  и передаем его в use для работы nodemailerom
import * as path from "path";

import { configs } from "../configs/config";
import { allTemplates } from "../constants/email.constants";
import { EEmailActions } from "../enums/email.enum";

class EmailService {
  private transporter;
  //приватная перемеенная transporter. В нее будет помещен результат вызова функции createTransport от  nodemailer

  constructor() {
    this.transporter = nodemailer.createTransport({
      from: "No reply",
      //Адрее почты который будет указан noReply@gmail.com
      service: "gmail",
      auth: {
        user: configs.NO_REPLY_EMAIL,
        pass: configs.NO_REPLY_PASSWORD,
      },
    });
    //Создаем переменную hbsOptions в которой будут храниться параметры, опции которые будут передаваться в транспортер
    const hbsOptions = {
      viewEngine: {
        extname: ".hbs",
        //Указываем расширения файлов которые будем использовать.
        defaultLayout: "main",
        // Название файла где прописана структура hbs
        layoutsDir: path.join(
          //Тут указываем путь к папке с loyouts. при помощи path.join
          process.cwd(),
          "src",
          "email-templates",
          "layouts"
        ),

        partialsDir: path.join(
          //Указываем путь к папке где находяться partials.
          process.cwd(),
          "src",
          "email-templates",
          "partials"
        ),
      },

      viewPath: path.join(process.cwd(), "src", "email-templates", "views"),
      //Указываем путь к папке где будут аходиться hbs с основным контентом.
      extName: ".hbs",
      //Расширение с которым мы будем работать.
    };

    this.transporter.use("compile", hbs(hbsOptions));
    //Для того что бы nodemailler взаимодействовыл с hbs необходимо при помощи use передать в тарнспортер что бы он использовал
    //для компиляции hbs и в hbs передать  его настройками.
  }

  //Внутри класса создаем метод sendMail который будет отправлять сообщения
  public async sendMail(
    email: string,
    emailAction: EEmailActions,
    context: Record<string, string | number> = {}
  ) {
    //В аргументы передаем такие параметры:
    //1)email - почту на которую высылаем письмо.
    //2)
    const { templateName, subject } = allTemplates[emailAction];

    const mailOptions = {
      to: email,
      //куда высыылакем письмо(адресс електронной почты)
      subject,
      //subject - это условный header нашего email.
      template: templateName,
      //Указываем название hbs которую хотим отрендерить. 'register'
      context,
    };

    return await this.transporter.sendMail(mailOptions);
    //С данного метода мы возвращаем вызов метода sendMail от созданного transporter  и в него передаем mailOptions
    //с параметрами для отправки почты.
  }
}

export const emailService = new EmailService();

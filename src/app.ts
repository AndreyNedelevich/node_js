import express, { NextFunction, Request, Response } from "express";
import * as mongoose from "mongoose";

import { configs } from "./configs/config";
import { ApiError } from "./errors";
import { authRouter } from "./routers/auth.router";
import { userRouter } from "./routers/user.router";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CRUD - create, read, update, delete

app.use("/users", userRouter);
app.use("/auth", authRouter);

app.use((err: ApiError, req: Request, res: Response, next: NextFunction) => {
  const status = err.status || 500;

  return res.status(status).json({
    message: err.message,
    status: err.status,
  });
});

app.listen(configs.PORT, () => {
  mongoose.connect(configs.DB_URL);
  console.log(`Server has started on PORT ${configs.PORT} 🥸`);
});

//Устанавливаем nodeMailler длю отправки сообщения на почту прользователей для подтверждения каких то действий.
//Обезательно вместе с  nodeMailler устанавливаем его типы -> @types/nodemailer

//Основное преимущество в использовании в email engins в том что мы можем динамически прокидывать в нее информацию.

//Для отоправки собщений можно использовать обычный html но он не такой мощный. Как правило используют два email engins:
// 1)  hbs  -> лучше использовать потому что он максимально похож на синтасис html.

// 2) pug -> синтаксис pug более не привычный.

//Что бы nodemailer работал с hbs в средине express необходимо доустановить библиотеку     "nodemailer-express-handlebars"
//И подружить их при помощи this.transporter.use("compile", hbs(hbsOptions)); (данная логика внутри файла email.service)
// Плюс устанавливаем типы   ** @types/nodemailer-express-handlebars **   для  nodemailer-express-handlebars

//hbs - расшифровуеться  handlebars

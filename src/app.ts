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
//Роутеры которые будут отрабатывать на аторизацию.

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

//************************                 Теория            **************************************

//Есть такие два понятие как аутификация и авторизация
//Разница  между ними в том что аутификация - проверяет кто ты есть(есть ли он в БД), авторизация оперделяет то что может делать пользоватоель (его права).

// Бибилиотека JSON jsonwebtoken
//Предназначенна для создания web tokens. (Access и Refresh)
//Access  прикрепляеться  к каждому запроссу для проверки пользователя на аутификацию и что бы доступить к каком то ендпонинту.(выдаеться при входе в акаунт) В среднем жтвет 15 до 30 мин.
//Refresh токен (живет 15-60 дней) предназначен для обновления access токена. (генерируеться новая пара) Refresh токен однаразовый.

//!!!!!Обезаетлньно вместе jsonwebtoken устанавливаем типизацию для него @types/jsonwebtoken


//  Бибилиотека "bcrypt"

//Бибилиотека для хиширования паролей. Расхишировать пароль мы не сможем а можем только при помощи специальных методов произодить
//сравнения паролей. введеного и хешированного.

//!!!!!Обезаетлньно вместе Бибилиотекой "bcrypt" устанавливаем типизацию для него "@types/bcrypt": "^5.0.0",

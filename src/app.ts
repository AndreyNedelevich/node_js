import express, { NextFunction, Request, Response } from "express";
import * as mongoose from "mongoose";

import { configs } from "./configs/config";
import { ApiError } from "./errors";
import { userRouter } from "./routers/user.router";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CRUD - create, read, update, delete

app.use("/users", userRouter);

//ОЧЕНЬ ВАЖНО ПОНИМАТЬ ЧТО ВСЕ ОШИБКИ КОТОРЫЕ БУДУТ ВЫЛЕТАТЬ НА СЕРВЕРЕ БУДУТ ОБРАБАТЫВАТЬ И ОТДАВАТЬ ОТВЕТ НА ФРОНТ В
// ОДНОМ МЕСТЕ В ЭТОМ HENDLERE.(КОД НИЖЕ!!!)
app.use((err: ApiError, req: Request, res: Response, next: NextFunction) => {
  const status = err.status || 500;
  //Возвращаем при помощи res.status -> статус ошибки  и json -> сообщение ошибки и е статус
  return res.status(status).json({
    message: err.message,
    status: err.status,
  });
});

app.listen(configs.PORT, () => {
  mongoose.connect(configs.DB_URL);
  console.log(`Server has started on PORT ${configs.PORT} 🥸`);
});

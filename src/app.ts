import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import rateLimit from "express-rate-limit";
import * as mongoose from "mongoose";
import * as swaggerUi from "swagger-ui-express";

//Импортируем все с библиотеки swagger
import { configs } from "./configs/config";
import { cronRunner } from "./crons";
import { ApiError } from "./errors";
import { authRouter } from "./routers/auth.router";
import { userRouter } from "./routers/user.router";
import * as swaggerJson from "./utils/swagger.json";
//Импорируем json  с описанием наших Route и передаем его в метод swaggerUi.setup(swaggerJson)
//ЧТо бы использовать json устанавливаем в tsConfig  - >     "resolveJsonModule": true

const app = express();

//ДЛя использование библиотеки  express-rate-limit вызываем функцию rateLimit и передаем в нее конфигурацию.
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  //Время за какое можно сделать количество запросов.
  max: 10,
  //100 хапросов за 60 секунд
  standardHeaders: true,
  //ЧТо бы в Header можно юыло вернуть какие то данные.
});

app.use("*", apiLimiter);
//Передаем в нашу app -> apiLimiter. (* добавляем на все ендпоинты)
//Также потенциально можно добавлять на отдельный ендпоинт. app.use("/users",apiLimiter, userRouter);

app.use(
  cors({
    origin: "*",
    //Откуда будет запрос на API и данный адресс будет разрешен.
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    //Какие запроссы разрешенны на API и с какого адресса.
    allowedHeaders: [
      //Позволяем какие то Header.
      "Authorization",
      "Content-Type",
      "Origin",
      "Access-Control-Allow-Origin",
    ],
    preflightContinue: false,
    optionsSuccessStatus: 200,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CRUD - create, read, update, delete

app.use("/users", userRouter);
app.use("/auth", authRouter);
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerJson));
//Что бы swagger использовать в проекте прописываем его в app.

app.use((err: ApiError, req: Request, res: Response, next: NextFunction) => {
  const status = err.status || 500;

  return res.status(status).json({
    message: err.message,
    status: err.status,
  });
});

app.listen(configs.PORT, async () => {
  await mongoose.connect(configs.DB_URL);
  cronRunner();
  //Запускаем метод   cronRunner(); который запускает функцию с Cronoy внутри.
  console.log(`Server has started on PORT ${configs.PORT} 🥸`);
});

//                        БИБЛИОТЕКА    CRON

// СRON дает возможность запускать определенные скрипты в определенные моменты времени.
//Cron то функция кторая просто запуститься в определенный момент веремни. Который мы зададим.

//                       БИБЛИОТЕКА   Day .js

//Бибилиотека которая позволяет работать с Датами.
//Также есть библиотека Момутt js но лучше использовать Day .js
// Если в обычном формате вызвать dayjs он будет смотреть на время установленное внутри компьютера  и будет учитывать time zone компьютера.

//                       БИБЛИОТЕКА    UTC

//Но в ситуации когда токены в БД сохраненны были в нулефой тайм зоне. Построить логику их удаления не удасца так как
//Day .js возьмет время с компьютера и тайм зоны не совпадут.
//Для того что бы   Day .js  в пределах APP привести к нулевой тайм зоны  используем библиотеку  ** UTC **

//                     БИБЛИОТЕКА   "swagger-ui-express":
// Библиотека для документации API
// по Url https://petstore.swagger.io/ -  можно посмотреть как выглядит swagger

// пишеться в  виде json а сам Swagger превращает в граическое отображения.

//                   БИБЛИОТЕКА  express-rate-limit

// Позволяет ограничивать количество запросов с какого то API фдресса.

import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import fileUpload from "express-fileupload";
// Библиотека которая позволит express работать с файлами и доставать файлы с request. Это позволи в request иметь отдельное
//поле под названием file где будут находиться фото отправленные с клиента.
import rateLimit from "express-rate-limit";
import * as mongoose from "mongoose";
import * as swaggerUi from "swagger-ui-express";

import { configs } from "./configs/config";
import { cronRunner } from "./crons";
import { ApiError } from "./errors";
import { authRouter } from "./routers/auth.router";
import { userRouter } from "./routers/user.router";
import * as swaggerJson from "./utils/swagger.json";

const app = express();

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
});

app.use("*", apiLimiter);
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: [
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
app.use(fileUpload());
//Для того что бы express мог работать с файлами. Добавляем библиотеку fileUpload() в нашу app.

// CRUD - create, read, update, delete

app.use("/users", userRouter);
app.use("/auth", authRouter);
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerJson));

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
  console.log(`Server has started on PORT ${configs.PORT} 🥸`);
});

//                       Библиотека express-fileupload

//Для загрузки файлов.

//                      Библиотека  "@aws-sdk/client-s3

// Создание бакета в сервисе Amazon C3

//Заходим в серис C3 оздаем Backet

//Желательно выбирать одтин и тот же регион. ТО что не используем то удаляем.
//ВЫбираем ACLs enabled (их необходимо отключить)
//Снимаем галочку с Block All public access
//Заходим в созданный бакет. Кликая на него в списке.

//После создания Бакета создаем ПОЛИСИ при помощи сервиса  IAM
//Внутри сервиса IAM выбираем вкладку слева Policies
//Далее выбираем для какого сервиса мы создаем Policy (это роль)

//Внутри Policy в Read выбираем GetObject
//Внутри Policy в Write выбираем putObject и DaleteObject
//Внутри Policy в Promissions management выбираем все
// В Specific выбираем any во всех пунктах
//После создание Policy указываем имя такое же как и у Backet

//Далее создаем User который будет управлять данной Policy в Add Users.
//Указываем имя User и
// выбираем Provide User Access и внутри **  I want to create an IAM user  ** что бы сделать дополнитешьные настройки но это не обезательно.
//В Set permissions выбираем и отмечаем галочкой AdministratorAccess (роль администратора)
//После next выбираем создать create User.

//Выбираем созданного user из списка и заходим в его настройки.

//Далее заходим в пункт Security credentials
//Создаем Access keys при помощи пункта create access key

//Внутри сервисса выбираем Third-party-service и соглашаемся с условиями
//Созданные ключи копируем в .env файл в проект    AWS_ACCESS_KEY     и    AWS_SECRET_KEY

//Далее заходим в сервис IEM/Users выбираем user и внутри него в Permissions policies нажимаем Add permissions
// Далее в следующем меню выбираем Attch policies directly
// И выбираем созданную нами полиси из списка. И она должна добавиться к User.

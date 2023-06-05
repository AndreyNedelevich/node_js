import express, { Request, Response } from "express";
//Обезательно подтягиваем типы для модуля express через автокомплит.

//*********************НАСТРОЙКА В PACKAGE JSON ЗАПУСКА SCRIPT (NPM START)

// библиотека rimraf   -   предназначенна что бы внутр  файла package json удалять скриптом файлы.
//пример  "rimraf dist && tsc-watch --onSuccess \"npm run watch\"",

//tsc-watch - библиотека при помощи которой мы запускаем компиляцию ts в js о при этом она имеет событие --onSuccess которое срабатывает при окончании
//компиляции и мы запускаем после окончания npm run watch  он описан в следующей строке.
// Данный скрипт запускаем при помощи библиотеки nodemon   "watch": "nodemon \"src/app.ts\" --watch \"./src\""

//В nodemon тоже есть доп настройка --watch при помощи нее мы указываем за какой папкой он должен следить и при изменениях в ней будет презапущен сервер.
//ДЛя того что бы nodemon аботал и следил за файлами типа ts устанавливаем компилятор  ***  ts-node ***

//Для других Oперационных систем
// "scripts": {
//     "start": "rimraf dist && tsc-watch --onSuccess 'npm run watch'",
//         "watch": "nodemon 'src/app.ts' --watch './src'"
// },

//*************************************ESLINTER для TS*************************************************
// Установка eslinters ля TS  - ** npm install --save-dev @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint typescript  **

//Что бы подружить TS и LINTER ИСПОЛЬЗУЕМ ТАКИЕ БИБЛИОТЕКИ:
//    "eslint-plugin-prettier": "^4.2.1",
//  "eslint-config-prettier": "^8.8.0",

const users = [
  {
    name: "Oleh",
    age: 20,
    gender: "male",
  },
  {
    name: "Anton",
    age: 10,
    gender: "male",
  },
  {
    name: "Inokentiy",
    age: 25,
    gender: "female",
  },
  {
    name: "Anastasiya",
    age: 15,
    gender: "female",
  },
  {
    name: "Cocos",
    age: 25,
    gender: "other",
  },
];

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CRUD - create, read, update, delete

app.get("/users", (req: Request, res: Response) => {
  //Используем типы для параметров call Beck req: Request, res: Response
  res.status(200).json(users);
});

app.get("/users/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  res.status(200).json(users[+id]);
});

app.post("/users", (req: Request, res: Response) => {
  users.push(req.body);

  res.status(201).json({
    message: "User created.",
  });
});

app.put("/users/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  users[+id] = req.body;

  res.status(200).json({
    message: "User updated",
    data: users[+id],
  });
});

app.delete("/users/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  users.splice(+id, 1);

  res.status(200).json({
    message: "User deleted",
  });
});

const PORT = 5001;

app.listen(PORT, () => {
  console.log(`Server has started on PORT ${PORT} 🥸`);
});

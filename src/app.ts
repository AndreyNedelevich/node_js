import express, { NextFunction, Request, Response } from "express";
import * as mongoose from "mongoose";

//Импортируем прослойку mongoose.
//И обезательно импортируем типы для mongoose -    "@types/mongoose": "^5.11.97",
import { configs } from "./configs/config";
//Импортируем файл configs с переменными окружения.
import { ApiError } from "./errors";
import { User } from "./models/User.mode";
import { IUser } from "./types/user.type";
import { UserValidator } from "./validators";
//Импортируем статический класс что бы вызывать его методы для валидации.

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CRUD - create, read, update, delete

// абработки информация на сервере. Запрос с Бебекенда идет не на прямую в БД ,а через прослоки  Есть два типа этих прослоек:
//1) ODM - (Object document maping) - информация сохраняеться в базах mongo типа. (прослойка MONGOOSE)
//2) ORM - (Object relation maping) - для реляционных баз данных (для баз SQL типа.)  (прослойка typeorm,prisma)

app.get(
  "/users",
  async (req: Request, res: Response): Promise<Response<IUser[]>> => {
    try {
      //В методе select("-password") при помощи массива или в строке можно выключить те параметры которые мы не хотим видеть
      //в ответе от сервера
      const users = await User.find().select("-password");
      //Для того что бы достать всех пользователей с базы используем метод find  вызываем его от нашей модели User
      //Метод find() принимает  фильтрационный объект к примеру мы хоти достать все мужчин
      //К примеру получаем только мужчин - User.find({gender:Genders:Male})
      return res.json(users);
      //Указываем return что бы функция не была void. поетому используем return  и типизирцем что будет возвращаться из
      //данной функции Promise<Response<IUser[]>>
    } catch (e) {
      console.log(e);
    }
  }
);

app.post(
  "/users",
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<IUser>> => {
    try {
      const { error, value } = UserValidator.create.validate(req.body);
      //Вызываем метод create  от UserValidator и передаем в него через validate то что нам прислал front.
      //После валидации из данного метода при помощи дестуктиризации возвращаем  error (ошибку если есть), value (данные которые прошли валидацию)
      if (error) {
        throw new ApiError(error.message, 400);
      }
      const createdUser = await User.create(value);
      //Используем метод create от модели User что бы сохраить нового user  БД полученного на сервер.

      return res.status(201).json(createdUser);
    } catch (e) {
      next(e);
    }
  }
);

app.get(
  "/users/:id",
  async (req: Request, res: Response): Promise<Response<IUser>> => {
    try {
      const user = await User.findById(req.params.id);
      //При помощи метода findById находим user в нашей БД по параметру ID.

      return res.json(user);
    } catch (e) {
      console.log(e);
    }
  }
);

app.put(
  "/users/:id",
  async (
    req: Request,
    res: Response,
    next: NextFunction
    //обавляем в аргументы next и типизируем NextFunction и в блоке Catch аму error выбрасываем при помощи  next(e);
  ): Promise<Response<IUser>> => {
    try {
      const { id } = req.params;

      const { error, value } = UserValidator.update.validate(req.body);
      //Вызываем метод для валидации и передаем в него то что получаем с фронта и если данные валидны возвращаем их и записываем в базу данных.
      if (error) {
        throw new ApiError(error.message, 400);
        // Каждый раз кода мы хоим выбросить сообщение используем apiError() и передаем в него message который выдаст валидатор.
        //В качестве error.message  мы также можем вручную прописать текст ошибки и она в случае ошибки уйдет на фронт.
        //ПРИМЕР throw new ApiError('Что то пошло не так', 400);
      }
      const updatedUser = await User.findOneAndUpdate(
        { _id: id },
        { ...value },
        { returnDocument: "after" }
      );
      //Есть метод updateOne (при его использование в ответ получаем не совсем информативную информацию)
      // данный метод используют для обновления одного пользователя. Вторым параметром можно передать фильтрационный объект он имеетдва параметра:
      //1) поле по которому ищем  { _id: id },
      //2) ИНформация котторое мы хоим изменить в User    { ...value },
      //Что бы использовать третью опцию используем метод findOneAndUpdate (возвращает более информативную информацию) и третья опция будет
      // { returnDocument: "after" }дает возможность вернуть всего поользователя с обновленными полями. (after что бы пользователь вернулся после обновления данных в БД)

      return res.status(200).json(updatedUser);
    } catch (e) {
      next(e);
    }
  }
);

app.delete(
  "/users/:id",
  async (req: Request, res: Response): Promise<Response<void>> => {
    try {
      const { id } = req.params;
      await User.deleteOne({ _id: id });

      return res.sendStatus(200);
      //Здесь используем sendStatus так как мы возвращаем в ответ только один статус без какой лтбо информации с БД.
    } catch (e) {
      console.log(e);
    }
  }
);

//Что бы обрабатывать ошибки обращаемся к app используем метод use и в него передаем:
//!!!Очень важно В основном используеться три параметра (req, res next) но если мы хотим добавить error то она добавляеться только впереди перед тремя аргуметами
//При возникновении ошибки сама ошибка спустить и обработаеться в даннм handlere.

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  //Параметр next типизируем при помощи NextFunction (данную типизацию мы импортировали с express)
  const status = error.status || 500;
  // status берем с error Но иногода сама ошибка будет не наша. Тосить сюда спустяться все ошибки и даже те которые возникли
  // сами поэтому используем дефолтный status 500.
  return res.status(status).json(error.message);
  //ри ошиьки из данного Hendlera будем делать return статусса и текста ошибки.
});

app.listen(configs.PORT, () => {
  mongoose.connect(configs.DB_URL);
  //Делаем подключения к базе данных через  mongoose
  console.log(`Server has started on PORT ${configs.PORT} 🥸`);
});
//Путь URl и порту прописываем в файле env.

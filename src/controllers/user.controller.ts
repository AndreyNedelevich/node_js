import { NextFunction, Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
//Импоритруем UploadedFile для типизации получаемого файла.
import multer from "multer";
//Метод createReadStream который позволяет сделать Stream.
import { createReadStream } from "streamifier";

import { ApiError } from "../errors";
import { userMapper } from "../mapers/user.mapper";
import { s3Service } from "../services/s3.service";
import { userService } from "../services/user.service";
import { IUser } from "../types/user.type";

class UserController {
  public async findAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<IUser[]>> {
    try {
      const users = await userService.findAll();

      return res.json(users);
    } catch (e) {
      next(e);
    }
  }

  public async findById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<IUser>> {
    try {
      const { userId } = req.params;

      const user = await userService.findById(userId);

      const response = userMapper.toResponse(user);
      //Используем с class userMapper метод toResponse которые вернет поля пользователя но поле avatar, если будет отстутсвовать фото присвоит null.
      return res.json(response);
    } catch (e) {
      next(e);
    }
  }

  public async updateById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<IUser>> {
    try {
      const { userId } = req.params;

      const updatedUser = await userService.updateById(userId, req.body);

      const response = userMapper.toResponse(updatedUser);
      //Используем с class userMapper метод toResponse которые вернет поля пользователя но поле avatar, если будет отстутсвовать фото присвоит null.
      // или сформирует полный путь url на аvatar добавив в путь строку  **https://express-node.s3.amazonaws.com**

      return res.status(200).json(response);
    } catch (e) {
      next(e);
    }
  }

  public async deleteById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<void>> {
    try {
      const { userId } = req.params;

      await userService.deleteById(userId);

      return res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  }

  //Контролее отвечает за логику загрузки фото ползователя.
  public async uploadAvatar(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<void>> {
    try {
      const { userId } = req.params;
      //Достаем iD пользователя
      const avatar = req.files.avatar as UploadedFile;
      //Достаем файл с req.files. Типизируем его при помощи UploadedFile. Указывая что это будет только один файл.
      console.log(avatar);

      const user = await userService.uploadAvatar(userId, avatar);
      //Сервис будет принимать userId  и  avatar

      const response = userMapper.toResponse(user);
      return res.status(201).json(response);
    } catch (e) {
      next(e);
    }
  }

  public async deleteAvatar(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<void>> {
    try {
      const { userId } = req.params;

      const user = await userService.deleteAvatar(userId);

      const response = userMapper.toResponse(user);
      //Вызываем метод toResponse и передаем в него данные User. Данный метод вернет нам обработанные поля user (avatar) для фронта.
      // или сформирует полный путь url на аvatar добавив в путь строку  **https://express-node.s3.amazonaws.com**
      return res.status(201).json(response);
      //Возвращаем в response статус и  данные о самом user (бработанные в userMapper.toResponse)
    } catch (e) {
      next(e);
    }
  }

  public async uploadVideo(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const { userId } = req.params;
      const upload = multer().single("");
      //Мы используем multer с библиотеки "multer" ток как  fileupload (app.use(fileUpload());)  не позвляет делать стримы.
      //В методе single необходимо указать филду тот ключ который мы будем использовать во время загрузки. Его мы даем в названии файла.
      // Так как мы ключ указывали в fileUpload то здесь мы его не указываем. Также можно загружать и несколькоф файлов используя другие методы.
      //Сам Multer работает как middleware. Занимаеться загрузкой файлов.

      upload(req, res, async (err) => {
        //Внутри upload полученого с метода multer().single организовуем логику и он постепенно будет загружать видео файл. Метод асинхронный.
        //И главная идея стрима не держать файл в опереивной памяти.
        if (err) {
          throw new ApiError("Download error", 500);
          //По принципу midddleware если произойдет ошибка выбросим ее.
        }
        const video = req.files.video as UploadedFile;
        //Получаем бафер видео файла с котрого создаем стримы.

        const stream = createReadStream(video.data);
        //С помощью метода createReadStream  c библиотеки  streamifier  будем создавать stream

        const pathToVideo = await s3Service.uploadFileStream(
          //Вызываем метод uploadFileStream с С3 класса  передаем в него. При помощи него сам стрим будет перенаправлен в баакет и сохранен там.
          stream,
          //Сам стрим загрузки.
          "user",
          //Тип он же и папка для сохранения внутри бакета.
          userId,
          //ID пользователя
          video
          //Само видео которое достали с запроса.
        );

        return res.status(201).json(pathToVideo);
        //Возвращаем путь к видео.
      });
    } catch (e) {
      next(e);
    }
  }
}

export const userController = new UserController();

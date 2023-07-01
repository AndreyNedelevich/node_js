import { NextFunction, Request, Response } from "express";

import { avatarConfig } from "../configs/file.config";
import { ApiError } from "../errors";

//Middleare которая будет проверять валидность загруженного файла.
class FileMiddleware {
  public isAvatarValid(req: Request, res: Response, next: NextFunction) {
    try {
      //Благодаря добавлению чпециальной библиотеки "express-fileupload" появляеься спец поле files в request
      //Также с clients мы можем отправлять два два и боле файла. Они будут находиться в виде объекта где название это ключ. в нем бцдет
      //лбъект с свойствами например mimetype c ипом файла.В поле data в формате buffer будет зашит сам файл.

      if (Array.isArray(req.files.avatar)) {
        //Проверяем если с клиента прилетело более одного фото(Проверяем при помощи проверки isArray) Выбрасываем ошибку.
        throw new ApiError(`Avatar must be only one file`, 400);
      }

      const { mimetype, size } = req.files.avatar;
      //Достаем при помщи деструктиризации два поля mimetype, size с объекта avatar

      if (!avatarConfig.MIMETYPES.includes(mimetype)) {
        //Если массив разрешнных типом имеет тип указанный в том файле который мы получили пропускаем код далее если его нет
        //в разрешенных то выьрасываем ошибку.
        throw new ApiError(`Avatar has invalid format`, 400);
      }
      if (size > avatarConfig.MAX_SIZE) {
        //Проверка размера файла. Если размер превышает выбрасываем ошибку.
        throw new ApiError(`Avatar too big`, 400);
      }

      next();
      //Если все ок пускаем код далее.
    } catch (e) {
      next(e);
    }
  }
}

export const fileMiddleware = new FileMiddleware();

import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "joi";
import { isObjectIdOrHexString } from "mongoose";

//Импортируем из mongoose метод для валидации ID от MongoDB.
import { ApiError } from "../errors";

class CommonMiddleware {
  //Создаем метод валидации для ID. Данный метод вызваеть в router во всем путях где мы используем ID.Эта middleware будет универсальной и динамичной.
  public isIdValid(field: string) {
    //Для того что бы иметь возможность в одной Middleware проводить валидацию разных ID  и не создавать под каждлый вариант ID
    //отельную Middleware мы внутри метода isIdValid принамаем  как аргумент ID. Далее из данного метода возвращаем функцию внутри
    //которой делаем логику валидации ID и ппрокидываем валидируемый ID из в нее ** const id = req.params[field]; **
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = req.params[field];
        //Достаем из params. !!!!! Динамически то название ID которое будет переданно как аргумент в наш метод isIdValid.
        //Мы его помещаем в квадартные скопки это название будет ключои по котороиу из объекта мы домтаем по этому ключу value.

        if (!isObjectIdOrHexString(id)) {
          //В самой ODM есть специальный метод который помгает валидировать ID которое нам присылает Фронт.
          //Есть два метода валидации:
          //1) isObjectIdOrHexString(id) -> более жесткая валидация id.
          //2)isValidObjectId(id) - > более лояльная валидация ID
          throw new ApiError(`Id ${field} not valid`, 400);
          // Если будет ошибка мы ее выбрасываем.
        }

        next();
      } catch (e) {
        next(e);
      }
    };
  }

  //Данная Middleware будет также вызываться по принципу возврата внутри метода isBodyValid другой функции с логикой валидации для создания нового USER.
  //лагодаря такому механизму в аргумент метода isBodyValid мы передаем ВАЛИДАТОР КАК способ валидации.И далее по коду подставляем его.

  public isBodyValid(validator: ObjectSchema) {
    //Обезательно ттипизируем validator при помощи импорта из библиотеки "joi"  типа ObjectSchema
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        const { error, value } = validator.validate(req.body);
        if (error) {
          throw new ApiError(error.message, 400);
        }

        req.body = value;
        //В отличии от предидущего варианта в lessons 5 мы ложи валидные данные не в поле locals, а помещаем их в то же поле
        //в котором и взяли ** req.body  **
        //Как правило в поле local ложат что то новое если мы это хотим добавить.
        next();
      } catch (e) {
        next(e);
      }
    };
  }
}

export const commonMiddleware = new CommonMiddleware();

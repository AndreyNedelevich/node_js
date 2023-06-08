import Joi from "joi";

//Импортируем библиотеку для валидации той информации которая отдает на фронт
import { regexConstants } from "../constants";
import { EGenders } from "../enums/user.enum";

export class UserValidator {
  static firstName = Joi.string().min(3).max(30).trim();
  static age = Joi.number().min(1).max(199);
  static gender = Joi.valid(...Object.values(EGenders));
  //Используем команду от JOI valid и в нее предаем при помощи Object.values все значение ключей.Тоисть превращаем Enum  список
  static email = Joi.string()
    .regex(regexConstants.EMAIL)
    .lowercase()
    //Очень важно email сохранять в базе данных в формате lowercase()
    .trim()
    .messages({
      "string.empty": "Це поле обов'язкове",
      "string.email": "Адрес электронной почты имеет неверный формат",
      // При помощи   .messages выбрасываем тек+кст ошибки далее при помощи на спускаеться в Handler обработчик ошибок и отправляеть на фронт в виде error.message
    });
  static password = Joi.string().regex(regexConstants.PASSWORD).trim();
  //Через regex () добвляем регулярное выражение которое находиться в файле  regex.constans

  static create = Joi.object({
    //Внутри объекта Joi.object() приписываем все поля и валидацию для каждого объекта.
    name: this.firstName.required(),
    // через this обращаемся к внутренним переменным class в которых содержаться валидационные выражения для joi что бы использовать
    //их в нескольких местах.
    age: this.age.required(),
    gender: this.gender.required(),
    email: this.email.required(),
    password: this.password.required(),
  });

  static update = Joi.object({
    name: this.firstName,
    age: this.age,
    gender: this.gender,
  });
}

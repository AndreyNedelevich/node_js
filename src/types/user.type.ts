import { Types } from "mongoose";
// Достаем  Types что бы из них вытянуть нужные нам типы например Types.ObjectId - для типизации поля id которое геенрируеться
// в mongo db

export interface IUser {
  _id: Types.ObjectId;
  //Типизацию для id которое нам отодает Mongo DB достаем из библиотеки "mongoose"
  name: string;
  age: number;
  gender: string;
  email: string;
  password: string;
}

//ИНтерфейс User используем для типизации данных которые возвращаються из функции.

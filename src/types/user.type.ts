import { Types } from "mongoose";

export interface IUser {
  _id: Types.ObjectId;
  name?: string;
  age?: number;
  gender?: string;
  email: string;
  password: string;
}

// export type IUserWithoutPassword = Omit<IUser, "password">;
//Создаем тип для типизации User без пароля для того что бы иметь тип на основе User о без пароля.
//Данная типизация для примера ее мы не используем.

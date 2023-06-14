import { IUser } from "./user.type";

export interface ITokensPair {
  accessToken: string;
  refreshToken: string;
}

export type ICredentials = Pick<IUser, "email" | "password">;
//Типы для логинации.

export type ITokenPayload = Pick<IUser, "name" | "_id">;
//Типы для той информации которую мы расшифровуем с  токенов. (payload)

//При помщи Pick  в TS  мы создаем отодельный интерфейс в который попадут все поля  которое мы укажем (позволяет с какого то
//другого интерфейса достать отдельные  поля и для них создать отдельный type ) Плюс в конце можно его чем то расширить. ,{}
// export interface ICredentials extends Pick<IUser>,'password'

//При помщи Omit  в TS можем выбрасить с какого то интерфейса какое то одно поле или два на из того что осталось создать отдельный type.
// export interface ICredentials extends Omit<IUser>,'password'

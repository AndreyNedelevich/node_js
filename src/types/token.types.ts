export interface ITokensPair {
  accessToken: string;
  refreshToken: string;
}

export interface ICredentials {
  email: string;
  password: string;
}
//При помщи Omit  в TS можем забрать с какого то интерфейса какое то одно поле и на его основе создать отдельный интерфейс.
// export interface ICredentials extends Omit<IUser>,'password'



//При помщи Pick  в TS  мы создаем отодельный интерфейс в который попадут все поля кроме того которое мы укажем (позволяет с какого то
// интерфейса одно поля и для оставшихся создать интерфейс)
// export interface ICredentials extends Pick<IUser>,'password'
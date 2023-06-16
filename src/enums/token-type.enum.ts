export enum ETokenType {
  Refresh = "refresh",
  Access = "access",
}
//Создаем enum ETokenType для передачи одного из полей данной enum как аргумента  для определения ключа для расшифроки access или refresh токена.
//Этой же Enum и типизируем.

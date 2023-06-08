export class ApiError extends Error {
  public status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

// Еспортируем класс для ошибок обезательно расширяемся от внутренего  глобального class Error c JS.
//В данном классе в констуктор прокидаем message и status
// В super в глобальный   клас Error мы передаем при помощи метода super -> message. Данный message мы выбрасываем в маршруте таким образом
// ** throw new ApiError(error.message, 400); ** Соответственно этот message попадает в родительский класс error от которого мы расширились.

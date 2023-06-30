import { removeOldPasswords } from "./remove-old-passwords";
import { removeOldTokens } from "./remove-old-tokens.cron";

export const cronRunner = () => {
  removeOldTokens.start();
  removeOldPasswords.start();
};
// В даннм файле создаем функцю внутри которой запускаем нашу КРОНУ.
//Далее функцию cronRunner запускам когда поднимаеть  app.
//Передаем ее в метод app.listen

//В данной функции cronRunne может быть любое количество Cron

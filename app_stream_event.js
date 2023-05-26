//*****************************************************************************************


//  NODE: EVENTS



// const event = require('node:events');
// //Импортируем модуль events  из  node
//
//
// const eventEmitter = new event()
// //Вызываем конструктор new event()   класса event
// //Получаем его екземпляр
//
//
// eventEmitter.on('click', (data) => {
//     console.log(data);
//     //Параметр data передали при вызове через метод .emit()
//     console.log('click,click');
//     //От этого екземпляра обращаемся у методу on. ПРи помощи него мы можем деклорировать некоторые event.
// // Метод  on  принимает два параметра 1) Название event 2) Сам CallBeck оторый будет отрабатывать когда этот
// //event удет вызван.
// })
//
//
// //ДЛя того что бы вызвать этот метод. Мы используем метод .emit()  от экхемпляра класса  eventEmitter
//
// eventEmitter.emit('click',{name:'Anton'})
// //В него можно передавать параметры в виде второго аргумента как объект
// //Вызвать можем этот event любое количество раз
//
//
//
// // Если мы хоти что бы он отрабатал только один раз используем метод  once() от экземп класса  eventEmitter
//
// eventEmitter.once('clickAndDie',()=>{
//     console.log('I am gonna die after being called');
// })
//
//
// eventEmitter.emit('clickAndDie');
// //Все что ниже не будет отрабатывать. После первого вызова он умрет.
// eventEmitter.emit('clickAndDie');
// eventEmitter.emit('clickAndDie');
// //Сколько бы мы раз его не вызывали он вызавиться только один раз.
//
// console.log(eventEmitter.eventNames());
// //Этот метод выведет все event которые будут задеклорированны в этом экземпляре класса.


//*************************************************************************************************************************

//STREAMS


const fs=require('node:fs')
const path=require('node:path')

//STREAM - позволяет обрабатывать файлы по кусочкам. Пример c You tube. При открытии любого видео мы получаем видео
//маленькими чанками и оно постепенно загружаеться и мы его сразу же смотрим.

const readStream= fs.createReadStream(path.join('test','text.txt'),{encoding:'utf-8'})
//Используем метод createReadStream() из модуля fs  и в него передаем путь к тому файлу который пытаемся прочитать.

const writeStream=fs.createWriteStream(path.join('test','text2.txt'))
//Метод createWriteStream принимает новый путь куда мы хоти эти chunk записать. Он же создает файл text2.txt

// Создаем event
// readStream.on('data',(chunk)=>{
//     //chunk- это маленькая часть файла которого мы читаем. По стандарту один chunc заниает  65 килобайт
//     // console.log(chunk);
//     //Мы получаем этот файл не сразу а получаем его частями chunk по 64 килобит
//
//     //******************
//
//     writeStream.write(chunk);
// })


//ЕСть более легкая конструкция для того же функционала записи данных с strem


// const handleError=()=>{
//     //CALL Beck который сработает при ошибке записи информации в  файл по событию on('error',callBeck)
//     console.log('error!!!!');
//     readStream.destroy()
//     //Метод destroy() уничтажает его что бы прочтения не продолжадсь если выскочит какая то ошибка.
//
//     writeStream.end('Error while reading file')
//     //При помощи метода end мы записываем в конец файла один большой chunk  виде сообщения.
// }
//
//
// readStream
// . on('error',handleError)
//     // В методе on есть свои event. Используем event ('error')
// .pipe(writeStream)


//Еcть еще такие stream как duplexStream и transformStream. Их всего четыри:  duplexStream, transformStream, readStream, writeStream
// + readStream , writeStream (Их розбирали выше)

// duplex это тот стрим который можно одновременно и прочитать и записать
//transform - ??????????

//******************************************************************************************************************


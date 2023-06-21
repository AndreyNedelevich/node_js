//MODULS

//в файле app мы импортируем функцию helpHello при помощи метода require() в аргументе прописываем имя файла с которого хотим импортировать.
//через деструктиризацию достаем файл

const { sayHello} = require('./helper')

sayHello()

//  GLOBAL VARIABLES
//Переменные которые можно тспользовать глобально везде.

const {logTOConsole}=require('./test/test')

console.log('From app.js');
console.log(__dirname);
//Выводит путь к текущей директории (саму директорию)   //C:\Users\ASUS\Desktop\Okten Academy\NODE JS\node_js    //


console.log(__filename);
//Выводит путь к текущему файлу (включительно к самому файлу.)  //C:\Users\ASUS\Desktop\Okten Academy\NODE JS\node_js\app.js //

console.log(process.cwd());
//process.cwd() - если мы запускаем файл __dirname и process.cwd() - результат будет одним и тем же (покажет путь к директории) но если к примеру
//какая то функция созданно в одном файле а вызвана в другом то (process.cwd() покажет путь к директории именно где была запущенная функция.

logTOConsole()

///////////////////////////////////////////////////////////////////////////////////////
// console.log(process);
//process это огромный объекто в котором мы получаем досту к множеству методов для разроботки на NODE (в том числе и метод cwd))
//process -     ЭТО ТЕКУЩИЙ ПРОЦЕСС NODE КОТОРЫЙ МЫ ЗАПУСКАЕМ.


// БИБЛИОТЕКА PATH

// const path = require('path')

// const joinedPath=path.join('text','text2','text3.txt')

//Все что он делаем он просто соединяет пути. И по дефолту оценивает операционную систему и формирует пути исходя из ее особенностей
//так как формирование путей на windows и MAC отличаеться ( test/test.js -   MAc через /) ,(  test\test.js  - Windows  \ )

// console.log(joinedPath);
//text\text2\text3.txt


// const joinedPath2=path.join(__dirname,'text2','text3.txt')
//при помощи  __dirname получаем путь к директории и далее указываем путь к необхтмому файлу.


// const normolisedPath2=path.normalize('///test///test2///test.txt')
// console.log(normolisedPath2);
// Данный метод просто приводит пути к файлам к корректнму формату (исправляет ошибки в написании путей к файлу)

// const resolvedPath= path.resolve('test', 'test.js' )
// console.log(resolvedPath);
//этот метод аналог метода __dirname. В него просто передаем файл и он сам сделает путь с самого начала.
//PS C:\Users\ASUS\Desktop\Okten Academy\NODE JS\node_js>


//////////////////////////////////////////////////////////////////////////////////

//Module OS
// Он находиться под капотом lubiv
//При помощи него мы имеем доступ к нашейй операционной системе

const os = require('os')

// В нем также есть полезные приложения

 console.log(os.arch());
//x64   нформацию о аргитектуре процессора

// console.log(os.cpus());
//оказывает информацию о ядрах и нагрузки


////Module FC
//При помощи данного блока имеем досту к всей файловой систкмы компьютера.
//Можно прочитать файл создать файл или что то дописать в него.

const fs= require('fs');
const path = require('path')

//1)
//Можно создать  какой то файлик
fs.writeFile(path.join('test','text3.txt'),'hello Okten',(err)=>{
if(err) throw new Error(err.message)
})
//fs.writeFile принимает три  параметра 1) где создать файл  2) ЧТо мы хотим записать в наш файл  3) Это CAllBeck . принимает только ошибку





//2)Прочитать какой то файл
// fs.readFile(path.join( 'test','text.txt'), {encoding:'utf-8'},(err,data)=>{
//  if(err) throw new Error(err.message)
// console.log(data.toString())
// })

//Прочитать какой то файл внутри файловой системы. Обезательно используем метод path.join что бы не зависимо где будет открыт проект всегда будут построенны
// правильные пути
//Принимает два параметра путь и CAll Beck
//Если файл есть отработает CallBeck получим файл  типа baffer (понятный для ОС), если файла нет то выбрасываем ошибку.
//Что бы перевести информацию с Baffer используем опции  {encoding:'utf-8'}    или использовать метод JS toString()


//3) Добавить к какому то файлу какую то информацию. В  конец. Также в конце принимает CallBeck с одним аргуметом ошибкай и в нем можно ее обработать.

// fs.appendFile(path.join('test','text2.txt'), '\nHello Okten agan',(err)=>{
//  if(err) throw new Error()
// })

//4  Очищает всю информацию в заданном файле. Файл остаеться пустым.

// fs.truncate(path.join('test','text2.txt'),(err)=>{
//  if(err) throw new Error()
// })


//5) Метод который удаляет сам файл с содержимым.
// fs.unlink(path.join('test','text2.txt'),(err)=>{
//  if(err) throw new Error()
// })




//6)Метод  start из модуля stat выведит очень много информации про директорию
fs.stat(path.join('test'),(err,stats)=>{
 if(err) throw new Error()
 //console.log(stats);  //  информация о директории
 console.log(stats.isDirectory());   // true сли папка или alse если наоборот
 console.log(stats.isFile());     // true если файл и falsе если не файл
})






//В результате получаем масив с названиями всех файлов. [ 'test.js', 'text.txt', 'text2', 'text2.txt', 'text3.txt' ]

//7 Иожно прочитать саму дирректорию. Здесь CallBeck принимает уже data

fs.readdir(path.join('test'),{withFileTypes:true},(err,data)=>{
 if(err) throw new Error()
 console.log(data);
 // Выводим содержимое директории  [ 'test.js', 'text.txt', 'text2', 'text2.txt', 'text3.txt' ]

 // Получим  в массиве дополнительно прамметр symbol(type):1 алее итерируем
 data.forEach(file=>{
  console.log(file.isFile());
  //ДЛя каждого file вызываем метод который возращает true если итерируемый файл являеться file
 })
})


//9) Метод Создает директорию.   В том месте которое мы прописали в path
fs.mkdir(path.join('test','test2'),(err)=>{
 if(err) throw new Error()
})


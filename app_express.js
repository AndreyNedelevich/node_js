//                                     ТЕОРИЯ

// ДЛя того что бы Client  и  Server понимали друг друга  есть такая веща как ПРОТОКОЛЫ (HTTP)

//Протокол это наборр правил который уззгоджуеться для понимания в две сторонны
//На сервере есть http parcer который это все узгоджуе

//А сам процесс передачи данных происходит по пртоколу TCP (запрос отправляем по протоколу TCP)
//TCP это протокол передачи данных

//При отоправки запросса зоздаеться socket и отправки звапросса он создаеться и после получения ответа он умирает.
//ТОсить он каждый раз создаеться заново.

//Кождый компььютер или платформа в интерненте должна быть уникальна. ДЛя этого служит IP адресс (это определенный набор 9 цифр)
//МЫ делаем запрос на какой то IP адресс но при этом необходимо индифицировать какой то запросс это делаеться при помощи  какого то порта!!!!

//ПРИМЕР 209.85.128.0:5000
//До двух точек это IP после port

//В NODE.JS Мы можем менять какой то порт.


// DNS - ЭТО  DOMAIN NAME SYSTEM
// В интерненте есть одна большая база данных где находяться ДОМЕННЫЕ ИМЕННА
// КОГДА МЫ ДЕЛАЕМ ЗАПРОС НА КАКОЙТО САЙТ. Изначально в DNS  определяеться IP дресс и порт по которому он находиться
// и на него и делает запрос.


//******************      ПОДНИМАЕМ СЕРВЕР       (EXPRESS) ******************************

//Импортируем модуль 'express'
const express = require('express')
const PORT = 5120;

const app = express();
//Вызываем express() как функцию она возвращает app (app с которой мы будем дальше работать)

app.use(express.json());
app.use(express.urlencoded({extended: true}))
//Далаем так что наш сервер мог читать и парсить информацию которая находиться в body  запросса.
//Если используем express эти две команды необходимы обязательно прописыать эти две команды..


//Для того что бы поднять сервер который будет слушать определенный порт используем метод listen()
app.listen(PORT, () => {
    console.log(`server has start on Port ${PORT}`);
})
//он принимает port (который будем слушать) и CAllBeck которая сработает в конечном результате.

//Если мы зайдем в браузере на адресс http://localhost:5120/
//Увидим что сервер работает   Cannot GET /

/////////////////////////////////
//Что бы проверить открытые порты на компьютере в командной строке используем команду  **   netstat -a  **
// Вторая (netstat -aon) ещё и предоставляет идентификатор процесса, который можно затем найти в диспетчере задач.
//Команда по конкретному порту -  Get-Process -Id (Get-NetTCPConnection -LocalPort 5120).OwningProcess
//////////////////////////////
//**********************************************************************************************************************************************

// Запроссы которые мы можем отправлять на наш сервер
// app.post()
// app.put()
// app.path()
// app.delete()

//Создаем в обыяной переменной users
const users = [
    {
        name: 'Olena',
        age: 19,
        gender: 'male'
    },
    {
        name: 'Oleg',
        age: 25,
        gender: 'famale'
    },
    {
        name: 'Vasiliy',
        age: 22,
        gender: 'famale'
    },
    {
        name: 'Kokos',
        age: 29,
        gender: 'mix'
    },
]

app.get('/welcome', (req, res) => {
    //Данный обработчик сработает когда Client делает запрос на адресс /welcome.   Вторым параметром принимает CallBeck функцию.
    console.log('welcome');
    // res.end()
    //Так как в ответ на запрс welcome мы не чего не отадем. Браузер будет ждать ответ 2 минуты. Поэтому при помощи команды
    //из response.end() останавливаем его.

    res.send('welcome')
    //Что бы отодать что в ответ используем метод  send()   от res.  В основном отправляються какие то строчки.

})


//Далее просто создаем при помощи get адресс запроса и Call Back который будет выполнен при запрсе на '/users'.
//Получаем всех users
app.get('/users', (req, res) => {
    res.status(200).json(users);
    //При помощи status(200) мы определяем какой status код мы будем возвращать и в каких условиях
    //ЕСть специальная номерация кодов ее указываем в  status. И данный номер информирует  об успешности или не успешности запроса в зависимоти от номера..
})


//Получаем только отдельного User
app.get('/users/:userId', (req, res) => {
    // const {userId} = req.params
    //Через req.params получаем тот params который передали в строку запроса :userId

    console.log(userId);
    const user = users[+userId];

    res.json(user)
})


//Записываем нового User которого отдает клиент.
app.post('/users', (req, res) => {
    //cчитываем то что находиться в query. Если передаем после ? в адресную строку.
    // console.log(req.query);

    const body = req.body;

    users.push(body)
    console.log(body);

    //Прописываем при помощи поля res(ответ) который отдаст сервер в случаем успешного создания нового User.
    res.status(201).json({message: 'user created'})
    //status - что user спешно создан.
})



//Обновляем User  меняем ему все поля его данных. Полностью его перезаписываем.
app.put('/users/:userId', (req, res) => {
    const {userId} = req.params;
    const updatedUser = req.body;
    users[+userId] = updatedUser;

    //+ отправляем status 200 спешный
    res.status(200).json({
        message: 'user updated',
        data: users[+userId]
    })
})

// Удаляем конкретного User из моковой базы данных.
app.delete('/users/:userId', (req, res) => {
    const {userId} = req.params;

    users.splice(+userId,1)

    //+ отправляем status 200 спешный
    res.status(200).json({
        message: 'user  dalated',
    })
})







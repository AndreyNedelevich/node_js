// ДЗ:
//     Створіть папку
// В тій папці створіть 5 папок і 5 файлів
// І за допомогою модулю fs виведіть в консоль, чи це папка чи це файл

const fs=require('node:fs')

const path = require("node:path");



const createDir= async (path)=>{
    return new Promise((resolve,reject)=>fs.mkdir(path,(err)=>{
        if(err) return reject(err.message)
        resolve()
    }))
}




createDir(__dirname)
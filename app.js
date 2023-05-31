// ДЗ:
//     Створіть папку
// В тій папці створіть 5 папок і 5 файлів
// І за допомогою модулю fs виведіть в консоль, чи це папка чи це файл


const {writeFile, createDir,removeDir}=require('./helpers')

const path = require("node:path");




createDir(path.join(__dirname,'mainDir'))
// createDir(path.join(__dirname,'mainDir','dir1'))
// removeDir(path.join(__dirname,'mainDir'))

const dirs=['dir1','dir2','dir3','dir4','dir5','dir6']
const files=['file1.txt', 'file2.txt', 'file3.txt', 'file4.txt']

dirs.forEach((nameDir,index)=>{
    createDir(path.join(__dirname,'mainDir',nameDir))
        .then(()=>{
            files.forEach((fileName)=> writeFile( path.join(__dirname,'mainDir',nameDir,fileName),'text'))
        }).catch(err => console.log(err))
})


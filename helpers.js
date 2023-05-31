
const fs=require('node:fs')


const createDir= async (path)=>{
    return new Promise((resolve,reject)=>fs.mkdir(path,{recursive: true},(err)=>{
        if(err) return reject(err.message)
        resolve()
    }))
}

const removeDir= async (path)=>{
    return new Promise((resolve,reject)=>fs.rmdir(path,(err)=>{
        if(err) return reject(err.message)
        resolve()
    }))
}

const writeFile= async (path, data) => {
    return new Promise((resolve, reject) => fs.writeFile(path,data, (err) => {
        if(err) {
            return reject(err.message)
        }
        resolve()
    }))
}


module.exports = {
    writeFile,
    createDir,
    removeDir
}

const express = require('express')
const router = require('./router.js')
const serviceBD = require('./BD.sevice.js')

const fs = require('node:fs/promises')
const path=require('node:path')


const readFile= async ()=>{
    const data = await fs.readFile(path.join(__dirname,'dataBase','data_base.json'))
    const file=data.toString();
    return  JSON.parse(file)

}


(async ()=>{
   const res= await readFile()
    console.log(res);
})()



const PORT = 5100;

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use('/', router)


async function startApp() {
    try {
        app.listen(PORT, () => console.log('SERVER STARTED ON PORT ' + PORT))
    } catch (e) {
        console.log(e)
    }
}

startApp()

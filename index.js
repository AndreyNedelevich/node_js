const express = require('express')
const router = require('./router.js')
const serviceBD = require('./BD.sevice.js')

const fs = require('node:fs/promises')
const path=require('node:path')




const PORT = 5100;

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use('/api', router)


async function startApp() {
    try {
        app.listen(PORT, () => console.log('SERVER STARTED ON PORT ' + PORT))
    } catch (e) {
        console.log(e)
    }
}

startApp()

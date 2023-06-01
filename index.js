const express = require('express')
const serviceBD = require('./BD.sevice.js')


const PORT = 5100;

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}))


app.get('/users', async (req,res)=>{
    const users=await serviceBD.readFile()
    res.json(users)
})



async function startApp() {
    try {
        app.listen(PORT, () => console.log('SERVER STARTED ON PORT ' + PORT))
    } catch (e) {
        console.log(e)
    }
}

startApp()

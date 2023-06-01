const express=require('express')
const UserController=require('./UserController.js')

const controllerUser=new UserController()

const router = express.Router()


console.log(controllerUser.getAll);

router.get('/', (req, res)=>{
    res.send('welcome')
})
// router.post('/users', controllerUser.create)
router.get('/users', controllerUser.getAll)
// router.get('/users/:id', controllerUser.getOne)
// router.put('/users', controllerUser.update)
// router.delete('/users/:id', controllerUser.delete)




module.exports=router

const express=require('express')
const UserController=require('./UserController.js')

const router=express.Router()
const controllerUser= new UserController()


console.log(controllerUser.getAll());


// router.post('/users', controllerUser.create)
router.get('/users', controllerUser.getAll)
// router.get('/users/:id', controllerUser.getOne)
// router.put('/users', controllerUser.update)
// router.delete('/users/:id', controllerUser.delete)




module.exports=router;

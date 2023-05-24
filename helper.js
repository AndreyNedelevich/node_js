function sayHello (){
    console.log('say helo');
}

//Необезательно еспортровать объектом можно экспорировать вот так:
module.exports =  sayHello


module.exports = {
    sayHello,
    //ключ sayHello :   sayHello
}
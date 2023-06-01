const fs = require('node:fs');
const path = require('node:path')
const e = require("express");


module.exports = class ServiceBD {
    async readFile() {
        const data = await fs.readFile(path.resolve(__dirname, 'dataBase', 'data_base.json')).toString()
        if (!data) throw new Error('there is not data')
        return JSON.parse(data)
    }

    async writeFile(data) {
        await fs.writeFile(path.resolve(__dirname, 'dataBase', 'data_base.json'), JSON.stringify(data))
    }
}


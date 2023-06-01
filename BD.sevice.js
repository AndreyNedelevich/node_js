
const fs = require('node:fs/promises')
const path = require('node:path')

const dirPath=(path.join(__dirname,'dataBase','data_base.json'))

  const readFile=  async ()=> {
        const file = await fs.readFile(dirPath)
        const data=data.toString();
        if (!data) throw new Error('there is not data')
        return  JSON.parse(data)
    }

  const writeFile=  async (data) =>{
        await fs.writeFile(dirPath, JSON.stringify(data))
    }


module.exports={
    readFile,
    writeFile
}


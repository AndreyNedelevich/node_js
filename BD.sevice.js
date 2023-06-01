
const fs = require('node:fs/promises')
const path = require('node:path')

const dirPath=(path.join(process.cwd(),'dataBase','data_base.json'))

  const readFile=  async ()=> {
        const buffer = await fs.readFile(dirPath)
        const data=buffer.toString();
        return data? JSON.parse(data):[]
    }

  const writeFile=  async (data) =>{
        await fs.writeFile(dirPath, JSON.stringify(data))
    }


module.exports={
    readFile,
    writeFile
}


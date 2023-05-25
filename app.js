//ДЗ Создать папки и  файлы отодельно.


const fs = require('node:fs/promises')
const path = require('node:path')

//!!!!  ЕДИНСТВЕННЫЙ ЦИКЛ КОТОРЫЙ ЖДЕТ ВЫПОЛНЕНИЯ АССИНХРОННОГО КОДА ЭТО   *** FOR OF  ***

// const worker = async () => {
//     const fileNames = ['file1.txt', 'file2.txt', 'file3.txt', 'file4.txt'];
//     const folderNames = ['foder1', 'folder2', 'folder3', 'folder4']
//     try {

//         for (const folderName of folderNames) {
//             await fs.mkdir(path.join(process.cwd(), folderName, 'asd','ter'), {recursive: true})
//             //При помощи прописание второго название мы создаем вложенные папки внутри каждой  папки folderName
//             // {recursive:true} дает возможность игнорировать если такая папка уже содана. Цикл идет дальше.
//             //Но если такой папки не существует то он ее создаст.
//         }
//             for (const fileName of fileNames) {
//                 await fs.writeFile(path.join(process.cwd(), fileName),'Hell World' )
//                 // writeFile пепезаписвает
//             }}
//
//     catch(e)
//         {
//             console.error(e.message)
//         }
//     }
//
//     worker()

//ДЗ Создать папки с  файлами внутри.


const worker = async () => {
    try {
        const fileNames = ['file1.txt', 'file2.txt', 'file3.txt', 'file4.txt'];
        const folderNames = ['foder1', 'folder2', 'folder3', 'folder4'];

        const promises = folderNames.map(async (folderName, index) => {
            //Так сам цикл map не будет ждать выполнения асинхронной задач все промисы которые мы получаем после цикла мы слаживаем в одну переменную
            // и запускаем при помощи promiseAll.
            const folderPath = path.join(process.cwd(), folderName)
            await fs.mkdir(folderPath, {recursive: true});
            await fs.writeFile(path.join(folderPath , fileNames[index]), 'hello World')
        })
        // await Promise.all(promises)    // если упадет один промис то упадут все.
        //Для избежание такого поведения можно использовать Promise.allSetled()
        const a = await Promise.allSettled(promises)
        console.log(a);
        //МЕтож Promise.allSettled при нем выполняться все промисы а те которые реджектнуться можно отследить и перезапустить или обратится к
        //другому серверу. Но все успешные пойдут в роботу.

        const files = await fs.readdir(path.join(process.cwd()))
        //В переменной files имеем массив из всех папок.
        console.log(files);

        for (const file of files) {
            const stats = await fs.stat(path.join(process.cwd(), file));
            const isFile = stats.isFile();
            //Из stats.isFile()  - верненться true или false если папка являеться файлом - true и наоборот дирекорией false
            if (isFile) {
                console.log('This is File:', path.join(process.cwd(), file));
            }else {
                console.log('This is directory:', path.join(process.cwd(), file));
            }



        }

    } catch (e) {
        console.error(e.message)
    }
}


worker()




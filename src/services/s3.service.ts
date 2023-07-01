import path from "node:path";

//Импортируем необходимые методы для работы с клиентом для client-s3
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { UploadedFile } from "express-fileupload";
import { Readable } from "stream";
import { v4 } from "uuid";

import { configs } from "../configs/config";

class S3Service {
  constructor(
    //В методе мы настраиваем доступ к клиенту AVS через SDK при помощи class S3Client c бибоиотеки  @aws-sdk/client-s3
    //В опции передаем конфигурационный объект.
    private client = new S3Client({
      region: configs.AWS_S3_REGION,
      //И регион с AVS сервера
      credentials: {
        accessKeyId: configs.AWS_ACCESS_KEY,
        secretAccessKey: configs.AWS_SECRET_KEY,
        //Секетные ключи
      },
    })
  ) {}

  public async uploadFile(
    file: UploadedFile,
    itemType: "user",
    //Если мы хотим как то подразделять на другие папки то просто перечисляем их "user"|"posts"|"produkts" и так далее.
    itemId: string
  ): Promise<string> {
    //Как аргумент метод класса будет принимать файл, fileType(по дефолту может быть только user(какая то группа)), id user что
    //бы бвло видно кому этот файлик слаживать.

    const filePath = this.buildPath(itemType, itemId, file.name);
    //В filePath при посощи внутреннего метода делаем стринговый путь для каждого файла.

    await this.client.send(
      //Мы обращаемся к екземпляру class client он имеет в себе метод send.Данный метод принимает в себе команду которую
      //должен выполнить команду данную команду PutObjectCommand  достаем с библиотеки @aws-sdk/client-s3
      //В PutObjectCommand передаем опшины
      new PutObjectCommand({
        Bucket: configs.AWS_S3_NAME,
        //В какой бакет переносим файл.
        Key: filePath,
        //Путь - по которому будет конкретный путь к файлу внутри бакета
        Body: file.data,
        //Сам файл
        ACL: configs.AWS_S3_ACL,
        //Нужны для чтения файла.
        ContentType: file.mimetype,
        //Что бы понимал что за файл.
      })
    );
    return filePath;
  }

  public async deleteFile(filePath: string): Promise<void> {
    //Метод удаляещий фото с Bucket. Как аргумент принимает путь к файлу.
    await this.client.send(
      new DeleteObjectCommand({
        //DeleteObjectCommand команда для удаление конкретного файла в Бакете C3. В конфигурацию передаем Имя Bucket и путь к файлу.
        Bucket: configs.AWS_S3_NAME,
        Key: filePath,
      })
    );
  }

  public async uploadFileStream(
    stream: Readable,
    itemType: string,
    itemId: string,
    file: UploadedFile
  ): Promise<void> {
    const filePath = this.buildPath(itemType, itemId, file.name);
    //Для построения пути прокидаем в метод buildPath данные.

    await this.client.send(
      new PutObjectCommand({
        Bucket: configs.AWS_S3_NAME,
        Key: filePath,
        Body: stream,
        ACL: configs.AWS_S3_ACL,
        ContentType: file.mimetype,
        ContentLength: file.size,
      })
    );
  }

  //Метод который будет строить путь для каждого файла.
  private buildPath(type: string, id: string, fileName: string): string {
    return `${type}/${id}/${v4()}${path.extname(fileName)}`;
    //Используем метод v4() он вернет рандомную сторчку.
    //Последин мы добавляем файл поле name и при помощи его модуля path.extname достаем тольео его расширения.
  }
}
//Архитектуру самого бакета будем стороить при помощи построения путей где именно сохранять сам файл.

export const s3Service = new S3Service();
//Експортируем екземпляр класса new S3Service();

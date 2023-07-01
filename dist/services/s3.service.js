"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.s3Service = void 0;
const node_path_1 = __importDefault(require("node:path"));
const client_s3_1 = require("@aws-sdk/client-s3");
const uuid_1 = require("uuid");
const config_1 = require("../configs/config");
class S3Service {
    constructor(client = new client_s3_1.S3Client({
        region: config_1.configs.AWS_S3_REGION,
        credentials: {
            accessKeyId: config_1.configs.AWS_ACCESS_KEY,
            secretAccessKey: config_1.configs.AWS_SECRET_KEY,
        },
    })) {
        this.client = client;
    }
    async uploadFile(file, itemType, itemId) {
        const filePath = this.buildPath(itemType, itemId, file.name);
        await this.client.send(new client_s3_1.PutObjectCommand({
            Bucket: config_1.configs.AWS_S3_NAME,
            Key: filePath,
            Body: file.data,
            ACL: config_1.configs.AWS_S3_ACL,
            ContentType: file.mimetype,
        }));
        return filePath;
    }
    async deleteFile(filePath) {
        await this.client.send(new client_s3_1.DeleteObjectCommand({
            Bucket: config_1.configs.AWS_S3_NAME,
            Key: filePath,
        }));
    }
    async uploadFileStream(stream, itemType, itemId, file) {
        const filePath = this.buildPath(itemType, itemId, file.name);
        await this.client.send(new client_s3_1.PutObjectCommand({
            Bucket: config_1.configs.AWS_S3_NAME,
            Key: filePath,
            Body: stream,
            ACL: config_1.configs.AWS_S3_ACL,
            ContentType: file.mimetype,
            ContentLength: file.size,
        }));
    }
    buildPath(type, id, fileName) {
        return `${type}/${id}/${(0, uuid_1.v4)()}${node_path_1.default.extname(fileName)}`;
    }
}
exports.s3Service = new S3Service();

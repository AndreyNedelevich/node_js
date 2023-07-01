"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const multer_1 = __importDefault(require("multer"));
const streamifier_1 = require("streamifier");
const errors_1 = require("../errors");
const user_mapper_1 = require("../mapers/user.mapper");
const s3_service_1 = require("../services/s3.service");
const user_service_1 = require("../services/user.service");
class UserController {
    async findAll(req, res, next) {
        try {
            const users = await user_service_1.userService.findAll();
            return res.json(users);
        }
        catch (e) {
            next(e);
        }
    }
    async findById(req, res, next) {
        try {
            const { userId } = req.params;
            const user = await user_service_1.userService.findById(userId);
            const response = user_mapper_1.userMapper.toResponse(user);
            return res.json(response);
        }
        catch (e) {
            next(e);
        }
    }
    async updateById(req, res, next) {
        try {
            const { userId } = req.params;
            const updatedUser = await user_service_1.userService.updateById(userId, req.body);
            const response = user_mapper_1.userMapper.toResponse(updatedUser);
            return res.status(200).json(response);
        }
        catch (e) {
            next(e);
        }
    }
    async deleteById(req, res, next) {
        try {
            const { userId } = req.params;
            await user_service_1.userService.deleteById(userId);
            return res.sendStatus(204);
        }
        catch (e) {
            next(e);
        }
    }
    async uploadAvatar(req, res, next) {
        try {
            const { userId } = req.params;
            const avatar = req.files.avatar;
            console.log(avatar);
            const user = await user_service_1.userService.uploadAvatar(userId, avatar);
            const response = user_mapper_1.userMapper.toResponse(user);
            return res.status(201).json(response);
        }
        catch (e) {
            next(e);
        }
    }
    async deleteAvatar(req, res, next) {
        try {
            const { userId } = req.params;
            const user = await user_service_1.userService.deleteAvatar(userId);
            const response = user_mapper_1.userMapper.toResponse(user);
            return res.status(201).json(response);
        }
        catch (e) {
            next(e);
        }
    }
    async uploadVideo(req, res, next) {
        try {
            const { userId } = req.params;
            const upload = (0, multer_1.default)().single("");
            upload(req, res, async (err) => {
                if (err) {
                    throw new errors_1.ApiError("Download error", 500);
                }
                const video = req.files.video;
                const stream = (0, streamifier_1.createReadStream)(video.data);
                const pathToVideo = await s3_service_1.s3Service.uploadFileStream(stream, "user", userId, video);
                return res.status(201).json(pathToVideo);
            });
        }
        catch (e) {
            next(e);
        }
    }
}
exports.userController = new UserController();

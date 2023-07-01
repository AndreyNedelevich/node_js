"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileMiddleware = void 0;
const file_config_1 = require("../configs/file.config");
const errors_1 = require("../errors");
class FileMiddleware {
    isAvatarValid(req, res, next) {
        try {
            if (Array.isArray(req.files.avatar)) {
                throw new errors_1.ApiError(`Avatar must be only one file`, 400);
            }
            const { mimetype, size } = req.files.avatar;
            if (!file_config_1.avatarConfig.MIMETYPES.includes(mimetype)) {
                throw new errors_1.ApiError(`Avatar has invalid format`, 400);
            }
            if (size > file_config_1.avatarConfig.MAX_SIZE) {
                throw new errors_1.ApiError(`Avatar too big`, 400);
            }
            next();
        }
        catch (e) {
            next(e);
        }
    }
}
exports.fileMiddleware = new FileMiddleware();

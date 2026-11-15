"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploader = void 0;
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const appError_utils_1 = __importDefault(require("../utils/appError.utils"));
const uploader = () => {
    const folder = "uploads/";
    const file_size = 5 * 1024 * 1024; // 5 MB
    // Create the uploads folder if it doesn't exist
    if (!fs_1.default.existsSync(folder)) {
        fs_1.default.mkdirSync(folder, { recursive: true });
    }
    // Multer disk storage
    const storage = multer_1.default.diskStorage({
        destination: (req, file, cb) => {
            cb(null, folder);
        },
        filename: (req, file, cb) => {
            const file_name = `${Date.now()}-${file.originalname}`;
            cb(null, file_name);
        },
    });
    // Validate the uploaded file
    const fileFilter = (req, file, callback) => {
        const allowed_mime_type = [
            "image/jpeg",
            "image/png",
            "image/svg+xml",
            "image/avif",
            "application/pdf",
        ];
        if (!allowed_mime_type.includes(file.mimetype)) {
            callback(new appError_utils_1.default(`${file.mimetype} is not allowed`, 422));
            return;
        }
        callback(null, true);
    };
    // Create the Multer upload instance
    const upload = (0, multer_1.default)({
        storage,
        fileFilter,
        limits: {
            fileSize: file_size,
        },
    });
    return upload;
};
exports.uploader = uploader;

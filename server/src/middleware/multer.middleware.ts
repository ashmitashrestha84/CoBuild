import multer, { FileFilterCallback } from "multer";
import fs from "fs";
import appError from "../utils/appError.utils";
import { Request } from "express";

export const uploader = () => {
  const folder = "uploads/";
  const file_size = 5 * 1024 * 1024; // 5 MB

  // Create the uploads folder if it doesn't exist
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }

  // Multer disk storage
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, folder);
    },

    filename: (req, file, cb) => {
      const file_name = `${Date.now()}-${file.originalname}`;
      cb(null, file_name);
    },
  });

  // Validate the uploaded file
  const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    callback: FileFilterCallback,
  ) => {
    const allowed_mime_type = [
      "image/jpeg",
      "image/png",
      "image/svg+xml",
      "image/avif",
      "application/pdf",
    ];

    if (!allowed_mime_type.includes(file.mimetype)) {
      callback(new appError(`${file.mimetype} is not allowed`, 422));
      return;
    }

    callback(null, true);
  };

  // Create the Multer upload instance
  const upload = multer({
    storage,
    fileFilter,
    limits: {
      fileSize: file_size,
    },
  });

  return upload;
};

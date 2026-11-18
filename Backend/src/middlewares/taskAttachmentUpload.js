import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { extname } from "node:path";
import cloudinary from "../utils/claudinaryService.js";

const allowedTypes = new Map([
  ["image/jpeg", [".jpg", ".jpeg"]],
  ["image/png", [".png"]],
  ["image/webp", [".webp"]],
  ["image/avif", [".avif"]],
  ["application/pdf", [".pdf"]],
  ["text/plain", [".txt"]],
  ["text/csv", [".csv"]],
  ["application/msword", [".doc"]],
  [
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    [".docx"],
  ],
  ["application/vnd.ms-excel", [".xls"]],
  [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    [".xlsx"],
  ],
  ["application/vnd.ms-powerpoint", [".ppt"]],
  [
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    [".pptx"],
  ],
]);

const storage = new CloudinaryStorage({
  cloudinary,
  params: (_req, file) => ({
    folder: "task-attachments",
    resource_type: file.mimetype.startsWith("image/") ? "image" : "raw",
  }),
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 5,
  },
  fileFilter: (_req, file, callback) => {
    const extensions = allowedTypes.get(file.mimetype);
    if (!extensions?.includes(extname(file.originalname).toLowerCase())) {
      callback(new Error("Unsupported attachment type"));
      return;
    }

    callback(null, true);
  },
});

export const uploadTaskAttachments = (req, res, next) => {
  upload.array("files", 5)(req, res, (error) => {
    if (error instanceof multer.MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
        error.statuscode = 413;
        error.message = "Each attachment must be 10 MB or smaller";
      } else {
        error.statuscode = 400;
      }
    } else if (error?.message === "Unsupported attachment type") {
      error.statuscode = 400;
    }

    next(error);
  });
};

export const getTaskAttachmentResourceType = (mimeType) =>
  mimeType.startsWith("image/") ? "image" : "raw";

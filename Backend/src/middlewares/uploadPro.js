import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/claudinaryService.js";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  params: {
    folder: "avatars", // folder name in claudinary
    allowed_formats: ["jpg", "jpeg", "png", "webp", "avif"],
    transformation: [
      { width: 400, height: 400, crop: "fill", gravity: "face" },
    ], // optional resize
  },
});

const upload = multer({ storage, limits: { fieldSize: 5 * 1024 * 1024 } }); // 5mb limit

export default upload;

import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "quickcourt_avatars",
    allowed_formats: ["jpeg", "jpg", "png"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB
});

export default upload;

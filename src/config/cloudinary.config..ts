import { v2 as cloudinary } from "cloudinary";
import ENV_CONFIG from "./env.config";

cloudinary.config({
  cloud_name: ENV_CONFIG.CLOUDINARY_CLOUD_NAME,
  api_key: ENV_CONFIG.CLOUDINARY_API_KEY,
  api_secret: ENV_CONFIG.CLOUDINARY_API_SECRET,
});
console.log("Cloudinary configuration:", {
  cloud_name: cloudinary.config().cloud_name,
  api_key_loaded: !!cloudinary.config().api_key,
  api_secret_loaded: !!cloudinary.config().api_secret,
});
export default cloudinary;

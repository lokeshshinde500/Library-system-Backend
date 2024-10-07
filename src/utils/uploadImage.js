import { v2 as cloudinary } from "cloudinary";
import constant from "../config/constant.js";

// Configure Cloudinary secrets
cloudinary.config({
  cloud_name: constant.CLOUDINATY_CLOUD_NAME,
  api_key: constant.CLOUDINATY_API_KEY,
  api_secret: constant.CLOUDINATY_API_SECRET,
});

// Upload an image
export const uploadImage = async (path) => {
  try {
    const result = await cloudinary.uploader.upload(path);
    return result;
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw new Error("Image upload failed");
  }
};

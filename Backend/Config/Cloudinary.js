import cloudinary from "cloudinary";
import dotenv from 'dotenv';

dotenv.config();

cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,  // FIXED: Using uppercase
    api_key: process.env.CLOUD_API_KEY,  // FIXED: Using uppercase
    api_secret: process.env.CLOUD_SECRET_KEY // FIXED: Using uppercase
});
export default cloudinary;
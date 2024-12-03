import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

export const uploadFileOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        const res = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // clear server file 
        fs.unlinkSync(localFilePath);

        return res.url;
    } catch (error) {
        fs.unlinkSync(localFilePath);
        console.error("Cloudinary File Upload Error => " + error);
        return null;
    }
} 
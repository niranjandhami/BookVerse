import dotenv from "dotenv";
import cloudinary from "./config/cloudinary.js";
import fs from "fs";
import path from "path";

dotenv.config();

const imageFolder = "C:/MERA PROJECT/e images";

const uploadImages = async () => {
  try {
    const files = fs.readdirSync(imageFolder);

    for (const file of files) {
      const ext = path.extname(file).toLowerCase();

      if (![".jpg", ".jpeg", ".png", ".webp"].includes(ext)) continue;

      console.log(`Uploading ${file}...`);

      const result = await cloudinary.uploader.upload(
        path.join(imageFolder, file),
        {
          folder: "storyshelf",
        }
      );

      console.log(`${file} -> ${result.secure_url}`);
    }

    console.log("\n✅ All images uploaded successfully!");
  } catch (err) {
    console.error(err);
  }
};

uploadImages();
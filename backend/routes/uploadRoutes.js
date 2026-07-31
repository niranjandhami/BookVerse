import express from "express";
import upload from "../config/multer.js";

const router = express.Router();

router.post("/", (req, res) => {
  const uploadSingleImage = upload.single("image");

  uploadSingleImage(req, res, (err) => {
    console.log("Multer Error:", err);
    console.log("File:", req.file);

    if (err) {
      return res.status(400).json({
        message: err.message,
        error: err,
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "No image file provided",
      });
    }

    return res.status(200).json({
      message: "Image uploaded successfully",
      image: req.file.path,
    });
  });
});

export default router;
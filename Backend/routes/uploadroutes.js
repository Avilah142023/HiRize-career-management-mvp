import express from "express";
import upload from "../middleware/upload.js";
import auth from "../middleware/auth.js";
import File from "../models/File.js";

const router = express.Router();

// Resume upload
router.post("/resume", auth, upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const savedFile = await File.create({
      userId: req.user.id,
      fileType: "resume",
      originalName: req.file.originalname,
      fileName: req.file.filename,
      filePath: req.file.path,
    });

    res.status(201).json({
      message: "Resume uploaded successfully",
      file: savedFile,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Delete file
router.delete("/:id", auth, async (req, res) => {
  try {
    await File.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    res.json({ message: "File deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Cover letter upload
router.post(
  "/coverletter",
  auth,
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const savedFile = await File.create({
        userId: req.user.id,
        fileType: "coverletter",
        originalName: req.file.originalname,
        fileName: req.file.filename,
        filePath: req.file.path,
      });

      res.status(201).json({
        message: "Cover letter uploaded successfully",
        file: savedFile,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Document upload
router.post(
  "/document",
  auth,
  upload.single("document"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const savedFile = await File.create({
        userId: req.user.id,
        fileType: "document",
        originalName: req.file.originalname,
        fileName: req.file.filename,
        filePath: req.file.path,
      });

      res.status(201).json({
        message: "Document uploaded successfully",
        file: savedFile,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Get all uploads for logged-in user
router.get("/", auth, async (req, res) => {
  try {
    const files = await File.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });

    res.json({ files });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete file
router.delete("/:id", auth, async (req, res) => {
  try {
    await File.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    res.json({ message: "File deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;

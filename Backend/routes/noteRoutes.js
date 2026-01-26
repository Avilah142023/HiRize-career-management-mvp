import express from "express";
import Note from "../models/note.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Create note
router.post("/", auth, async (req, res) => {
  try {
    const { title, content } = req.body;

    const note = await Note.create({
      title,
      content,
      userId: req.user.id,
    });

    res.status(201).json({
      message: "Note saved successfully",
      note,
    });
  } catch (error) {
    console.error("Create note error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all notes for logged-in user
router.get("/", auth, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    res.json({ notes });
  } catch (error) {
    console.error("Fetch notes error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete note
router.delete("/:id", auth, async (req, res) => {
  try {
    await Note.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id, // security check
    });

    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Delete note error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

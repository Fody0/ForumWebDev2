import express from "express";
import * as NotesControllers from "../controllers/notes"

const router = express.Router();

router.get("/", NotesControllers.getNotes);

router.get("/:noteid", NotesControllers.getNote)

router.post("/", NotesControllers.createNote);

router.patch("/:noteid", NotesControllers.updateNote);

router.delete("/:noteid", NotesControllers.deleteNote);

export default router;
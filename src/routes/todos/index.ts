import { Router } from "express";
import verifyAuthenticatedReq from "./auth.js";
import listNotes from "./list.js";
import createNote from "./create.js";
import modifyNote from "./modifyNote.js";

const router = Router();

router.use(verifyAuthenticatedReq);
router.get('/list{/:id}', listNotes);
router.post('/create', createNote);
router.post('/modify', modifyNote);

export default router;
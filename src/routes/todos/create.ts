import type { Response } from "express";
import type { Request } from "../../types.js";
import { createNotes } from "../../db.js";

const createNote = async (req: Request, res: Response) => {
    if (!req.body || !req.body.note)
        return res.sendStatus(400);

    await createNotes(req.body.note, req.user!.id, req.body?.completed ?? 0);
    res.sendStatus(200);
};

export default createNote;
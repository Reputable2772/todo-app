import type { Response } from "express";
import type { Request } from "../../types.js";
import { createNote } from "../../db.js";

const create = async (req: Request, res: Response) => {
    if (!req.body || !req.body.note)
        return res.sendStatus(400);

    await createNote(req.user!.id, req.body.note, req.body?.completed ?? 0);
    res.sendStatus(200);
};

export default create;
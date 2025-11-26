import type { Response } from "express";
import type { Request } from "../../types.js";
import { deleteNote } from "../../db.js";

const del = async (req: Request, res: Response) => {
    if (!req.body || !req.body.id)
        return res.sendStatus(400);

    res.send(await deleteNote(req.user!.id, req.body.id));
};

export default del;
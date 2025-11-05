import type { Response } from "express";
import type { Request } from "../../types.js";

import { modifyNote } from "../../db.js";

const modifyNoteReq = async (req: Request, res: Response) => {
    if (!req.body || !req.body.note || !req.body.id)
        return res.send(400);

    const rowsMod = await modifyNote(req.user!.id, req.body.id, req.body.note, req.body?.completed || 0);
    res.send(rowsMod);
}

export default modifyNoteReq;
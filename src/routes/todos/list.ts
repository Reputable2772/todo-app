import type { Response } from "express";
import type { Request } from "../../types.js";
import { getNotes } from "../../db.js";

const listNotes = async (req: Request, res: Response) => {
    const params = [req.user!.id];
    if (req.params && req.params.id && parseInt(req.params.id))
        params.push(parseInt(req.params.id));

    // @ts-expect-error I can safely use the spread operator here.
    const notes = await getNotes(...params);
    res.send(notes);
};
export default listNotes;
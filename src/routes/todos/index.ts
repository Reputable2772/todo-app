import { Router, type NextFunction, type Response } from "express";
import { log, validateJWT } from "../../utils.js";
import { getUser } from "../../db.js";
import type { Request } from "../../types.js";

const router = Router();

const verifyAuthenticatedReq = async (req: Request, res: Response, next: NextFunction) => {
    if (req.user)
        return next();

    if (!req.cookies.token) return res.send(401);

    try {
        const user = await validateJWT(req.cookies.token);
        if (!user) return res.send(404);

        const updatedUser = getUser(user.userId);
        if (!updatedUser) {
            res.clearCookie('token');
            return res.sendStatus(401);
        }

        req.user = updatedUser;

        log('INFO', `${user.userId} User authenticated.`);
        next();
    } catch (err) {
        log('ERROR', err as string);
        res.clearCookie('token');
        return res.send(404);
    }
};

router.use(verifyAuthenticatedReq);

export default router;
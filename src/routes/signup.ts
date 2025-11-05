import type { Request, Response } from "express";
import { hashPwd, log, validateJWT } from "../utils.js";
import { createUser, getUser } from "../db.js";

export default async function signup(req: Request, res: Response) {
    if (req.cookies && req.cookies.token) {
        const user = await validateJWT(req.cookies.token);

        if (!user) {
            res.clearCookie('token');
            return;
        }
        const db_user = await getUser(user.userId);

        if (db_user)
            return res.send({ message: 'User already exists' });
    }

    if (!req.body || !req.body.email || !req.body.password) return res.send(401);

    const { email, password } = req.body;

    const user = await getUser(email);
    if (user)
        return res.send({ message: 'User already exists.' });

    createUser(email, await hashPwd(password));

    log('DEBUG', `Created new user with username ${email}`);

    res.send(200);
};
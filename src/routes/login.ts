import type { Request, Response } from "express";

import { getUser } from "../db.js";
import { comparePwd, createJWT, log } from "../utils.js";

export default function login(req: Request, res: Response) {
    if (!req.body || !req.body.email || !req.body.password)
        return res.sendStatus(404);

    let { email, password } = req.body;

    const user = getUser(email);

    if (!user)
        return res.sendStatus(404);

    if (!comparePwd(password, user.password))
        return res.sendStatus(404);

    const token = createJWT(user.id);

    res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'strict',
    });

    log('DEBUG', `${email} User logged in.`);

    res.send('Logged in.');
}
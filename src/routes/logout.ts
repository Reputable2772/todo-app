import type { Request, Response } from "express";

export default async function logout(req: Request, res: Response) {
    if (req.cookies && req.cookies.token) {
        res.clearCookie('token');
        res.send('Logged out.');
    }

    res.sendStatus(200);
}
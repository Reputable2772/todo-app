import 'dotenv/config';
import bcrypt from "bcryptjs";
import jwt, { type JwtPayload } from 'jsonwebtoken';
import type { JWTPayload, } from "./types.js";
import { promisify } from "util";

const verify = promisify(jwt.verify) as (token: string, secretOrPublicKey: string) => Promise<JwtPayload>;

const opts = {
    devMode: process.env.DEV_MODE == 'true',
    port: process.env.PORT || 8000,
    jwt_secret: process.env.JWT_SECRET || 'test',
    db: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        dbname: process.env.DB_NAME,
    },
};

for (const [k, v] of Object.entries(opts.db)) {
    if (!v)
        throw new Error(`Database Option: ${k} not set.`);
}

const log = (type: 'ERROR' | 'WARN' | 'INFO' | 'DEBUG', log: string) => {
    if (type == 'DEBUG' && !opts.devMode) return;
    console.log(`${type} - ${log}`);
};

const hashPwd = async (password: string) => {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    return bcrypt.hash(password, salt);
};

const comparePwd = (user_provided_pwd: string, server_side_pwd: string) => {
    return bcrypt.compare(user_provided_pwd, server_side_pwd);
};

const createJWT = (userId: number) => {
    return jwt.sign({ userId }, opts.jwt_secret, { expiresIn: '6h' });
};

const validateJWT = async (token: string): Promise<null | JWTPayload> => {
    try {
        const val = verify(token, opts.jwt_secret) as Promise<JWTPayload>;
        return val;
    }
    catch (err) {
        log('ERROR', err as string);
        return null;
    }
};

export {
    opts,
    log,
    hashPwd,
    comparePwd,
    createJWT,
    validateJWT,
};
import type { Request as _Request } from "express";
import type { JwtPayload } from "jsonwebtoken";

interface User {
    id: number;
    username: string;
    password: string;
}

interface Request extends _Request {
    user?: User;
}

interface JWTPayload extends JwtPayload {
    userId: User['id'];
}

interface Notes {
    id: number;
    note: string;
    created_date: TDateISO;
    last_modified_at: TDateISO;
    completed: 0 | 1;
    user_id: User['id'];
};

export type {
    User,
    Notes,
    JWTPayload,
    Request
}

// Thanks https://gist.github.com/MrChocolatine/367fb2a35d02f6175cc8ccb3d3a20054
// In TS, interfaces are "open" and can be extended
interface Date {
    /**
     * Give a more precise return type to the method `toISOString()`:
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString
     */
    toISOString(): TDateISO;
}

type TYear = `${number}${number}${number}${number}`;
type TMonth = `${number}${number}`;
type TDay = `${number}${number}`;
type THours = `${number}${number}`;
type TMinutes = `${number}${number}`;
type TSeconds = `${number}${number}`;
type TMilliseconds = `${number}${number}${number}`;

/**
 * Represent a string like `2021-01-08`
 */
type TDateISODate = `${TYear}-${TMonth}-${TDay}`;

/**
 * Represent a string like `14:42:34.678`
 */
type TDateISOTime = `${THours}:${TMinutes}:${TSeconds}.${TMilliseconds}`;

/**
 * Represent a string like `2021-01-08T14:42:34.678Z` (format: ISO 8601).
 *
 * It is not possible to type more precisely (list every possible values for months, hours etc) as
 * it would result in a warning from TypeScript:
 *   "Expression produces a union type that is too complex to represent. ts(2590)
 */
type TDateISO = `${TDateISODate}T${TDateISOTime}Z`;
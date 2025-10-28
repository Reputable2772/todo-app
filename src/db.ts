import Database from 'better-sqlite3';
import type { Database as DBType } from 'better-sqlite3';

import { log } from './utils.js';
import type { User } from './types.js';

const db = new Database('todos.db', { verbose: (msg) => log('DEBUG', msg as string), });
db.pragma('journal_mode = wal');

db.prepare(`
    CREATE TABLE IF NOT EXISTS Users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        password TEXT
    )
`).run();

db.prepare(`
    CREATE TABLE IF NOT EXISTS Notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        note TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        last_modified_at TEXT NOT NULL DEFAULT (datetime('now')),
        completed INTEGER NOT NULL DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES Users (id) ON DELETE CASCADE
    )
`).run();

db.prepare(`
    CREATE TRIGGER IF NOT EXISTS update_last_modified
    BEFORE UPDATE ON Notes
    FOR EACH ROW
    WHEN NEW.note IS NOT OLD.note OR NEW.completed IS NOT OLD.completed
    BEGIN
        SELECT NEW.last_modified_at = datetime('now');
    END;
`).run();

const getDb = (): DBType => db;

const dbRunner = <T>(type: 'get' | 'all' | 'run', statement: string, ...rem: unknown[]): T | null => {
    try {
        if (!statement)
            return null;

        const val = db.prepare(statement)[type](...rem) as T;

        if (!val)
            return null;

        return val;
    }
    catch (err) {
        log('ERROR', err as string);
        return null;
    }
};

function getUser(id: string | number): User | null {
    return dbRunner<User>('get', `SELECT id, email, password FROM Users WHERE ${typeof id == 'number' ? 'id' : 'email'} = ?`, id);
};

const createUser = (email: string, password: string) => dbRunner('run', 'INSERT INTO Users (email, password) VALUES (?, ?)', email, password);

export default getDb;
export { createUser, getUser };
import mysql2, { type Pool, type RowDataPacket, type ResultSetHeader } from 'mysql2/promise';
import { log, opts } from './utils.js';
import type { Notes, User } from './types.js';

const pool: Pool = mysql2.createPool({
    host: opts.db.host as string,
    user: opts.db.user as string,
    password: opts.db.password as string,
    database: opts.db.dbname as string,
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    idleTimeout: 60000,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
});

const dbRunner = async <T = ResultSetHeader>(statement: string, ...params: unknown[]): Promise<T | null> => {
    if (!statement) return null;
    try {
        const [rows] = await pool.execute<RowDataPacket[] | ResultSetHeader>(statement, params);
        return rows as T;
    } catch (err) {
        log('ERROR', err as string);
        return null;
    }
};

await dbRunner(`
	CREATE TABLE IF NOT EXISTS Users (
		id INT PRIMARY KEY AUTO_INCREMENT,
		email VARCHAR(255) UNIQUE NOT NULL,
		password VARCHAR(255) NOT NULL
	)
`);

await dbRunner(`
	CREATE TABLE IF NOT EXISTS Notes (
		id INT PRIMARY KEY AUTO_INCREMENT,
		user_id INT NOT NULL,
		note TEXT,
		created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
		last_modified_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		completed TINYINT(1) NOT NULL DEFAULT 0,
		FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
	)
`);

await pool.query('DROP TRIGGER IF EXISTS update_last_modified');
await pool.query(`
	CREATE TRIGGER update_last_modified
	BEFORE UPDATE ON Notes
	FOR EACH ROW
	BEGIN
		IF NEW.note <> OLD.note OR NEW.completed <> OLD.completed THEN
			SET NEW.last_modified_at = CURRENT_TIMESTAMP;
		END IF;
	END
`);

const getDb = (): Pool => pool;

const getUser = async (id: string | number): Promise<User | null> => {
    const rows = await dbRunner<User[]>(`SELECT id, email, password FROM Users WHERE ${typeof id === 'number' ? 'id' : 'email'} = ?`, id);
    return rows && rows.length ? rows[0] as User : null;
};

const createUser = async (email: string, password: string): Promise<number | null> => {
    const result = await dbRunner('INSERT INTO Users (email, password) VALUES (?, ?)', email, password);
    return result?.affectedRows ?? null;
};

const getNotes = async (userId: number, noteId?: number): Promise<Notes[] | []> => {
    const rows = await dbRunner<Notes[]>(`SELECT * FROM Notes WHERE user_id = ? ${noteId ? 'AND id = ?' : ''}`, ...(noteId ? [userId, noteId] : [userId]));
    return rows || [];
}

const createNotes = async (note: string, userId: number, completed: number = 0) => {
    const result = await dbRunner(`INSERT INTO Notes (note, user_id, completed) VALUES (?, ?, ?)`, note, userId, completed);
    return result?.insertId ?? null;
}

const modifyNote = async (userId: number, noteId: number, note: string, completed: number = 0) => {
    const result = await dbRunner(`UPDATE Notes SET note = ?, completed = ? WHERE user_id = ? AND id = ?`, note, completed, userId, noteId);
    return result?.affectedRows ?? null;
}

export default getDb;
export { createUser, getUser, createNotes, getNotes, modifyNote };

import mysql from 'mysql2/promise';
import IDBConnector from './IDBConnector';
import RobloxAccount from '../../rbx/RobloxAccount';
import IDBAccount from '../IDBAccount';

class MySQLConnector implements IDBConnector {
	host: string;
	user: string;
	pass: string;
	database: string;
	connection: mysql.Connection;

	/**
	 * Connects to the MySQL database
	 * @returns If the database was connected to succesfully
	 */
	async _connect(): Promise<boolean> {
		try {
			this.connection = await mysql.createConnection({
				host: process.env.DB_HOST,
				user: process.env.DB_USER,
				password: process.env.DB_PASS,
				database: process.env.DB_DB
			});

			console.log('[✅] Connected to the database');
			return true;
		} catch (ex) {
			console.log(`[❌] Failed to connect to the database (${ex})`);
			return false;
		}
	}

	/**
	 * Sets up the MySQL database
	 */
	async setupDB(): Promise<boolean> {
		if (!(await this._connect())) {
			return false;
		}
		try {
			await this.connection.execute(`
            CREATE TABLE \`accounts\` (
                id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
                user_id BIGINT NOT NULL,
                username VARCHAR(30) NOT NULL,
                password VARCHAR(30) NOT NULL,
                cookie VARCHAR(900) NOT NULL
            );`);
			console.log('[✅] Created accounts table');
		} catch (ex) {}

		return true;
	}

	/**
	 * Adds an account into the database
	 */
	async addAccount(
		userId: string,
		username: string,
		password: string,
		cookie: string
	): Promise<void> {
		try {
			await this.connection.execute(
				'INSERT INTO `accounts` (user_id, username, password, cookie) VALUES (?, ?, ?, ?)',
				[userId, username, password, cookie]
			);
			console.log(`[✅] Account ${username} inserted into the database!`);
		} catch (err) {
			console.log('[❌] Error inserting account: ' + err);
		}
	}

	/**
	 * Gets a random ROBLOX account from the database
	 */
	async getRandomAccount(): Promise<RobloxAccount | null> {
		const results: [IDBAccount[], mysql.FieldPacket[]] =
			await this.connection.query(
				'SELECT * FROM accounts ORDER BY rand() LIMIT 1'
			);

		const rows = results[0];

		if (rows.length < 1) {
			return null;
		}

		const row = rows[0];

		const account = new RobloxAccount(
			row.username,
			row.user_id,
			row.password,
			row.cookie
		);

		return account;
	}

	async getAllAccounts(): Promise<RobloxAccount[]> {
		const results: [IDBAccount[], mysql.FieldPacket[]] =
			await this.connection.query('SELECT * FROM accounts');

		const rows = results[0];
		let accounts = [];
		// convert row to actual accounts
		for (const row of rows) {
			accounts.push(
				new RobloxAccount(
					row.username,
					row.user_id,
					row.password,
					row.cookie
				)
			);
		}

		return accounts;
	}

	async getCount(): Promise<number> {
		interface IDBAccountCount extends mysql.RowDataPacket {
			accountsCnt: number;
		}
		const results: [IDBAccountCount[], mysql.FieldPacket[]] =
			await this.connection.query(
				'SELECT COUNT(*) as accountsCnt FROM accounts'
			);

		const row = results[0][0];

		return row.accountsCnt;
	}
}

export default MySQLConnector;

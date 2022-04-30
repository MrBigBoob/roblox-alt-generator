import mysql from 'mysql2/promise';

export default interface IDBAccount extends mysql.RowDataPacket {
	id: number;
	user_id: string;
	username: string;
	password: string;
	cookie: string;
}

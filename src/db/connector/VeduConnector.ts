import VeduDB from '@vedux/vedudb';
import IDBConnector from './IDBConnector';
import RobloxAccount from '../../rbx/RobloxAccount';

class VeduConnector implements IDBConnector {
	database: VeduDB;

	async setupDB(): Promise<boolean> {
		try {
			this.database = new VeduDB('database.json');
			console.log(`[✅] Vedu database setup`);
		} catch (err) {
			console.log(`[❌] Unexpected vedu error (${err})`);
			return false;
		}

		return true;
	}

	async addAccount(
		userId: string,
		username: string,
		password: string,
		cookie: string
	): Promise<void> {
		try {
			await this.database.set(userId.toString(), {
				username: username,
				userId: userId,
				password: password,
				cookie: cookie
			});

			console.log(`[✅] Account ${username} inserted into the database!`);
		} catch (err) {
			console.log('[❌] Error inserting account: ' + err);
		}
	}

	async getRandomAccount(): Promise<RobloxAccount> {
		const acc = this.database.random();

		return new RobloxAccount(
			acc.username,
			acc.userId,
			acc.password,
			acc.cookie
		);
	}

	async getAllAccounts(): Promise<RobloxAccount[]> {
		let accounts = [];
		const entries = Object.entries(await this.database.fetchAll());
		for (const [_, user] of entries as [string, any][]) {
			accounts.push(
				new RobloxAccount(
					user.username,
					user.userId,
					user.password,
					user.cookie
				)
			);
		}

		return accounts;
	}

	async getCount(): Promise<number> {
		return this.database.count();
	}
}

export default VeduConnector;

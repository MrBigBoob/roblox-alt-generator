import RobloxAccount from '../../rbx/RobloxAccount';

interface IDBConnector {
	/**
	 * Sets up the database
	 */
	setupDB(): Promise<boolean>;

	/**
	 * Adds an account into the database
	 */
	addAccount(
		userId: string,
		username: string,
		password: string,
		cookie: string
	): Promise<void>;

	/**
	 * Gets a random ROBLOX account from the database
	 */
	getRandomAccount(): Promise<RobloxAccount | null>;

	/**
	 * Gets all the ROBLOX accounts from the database
	 */
	getAllAccounts(): Promise<RobloxAccount[]>;

	/**
	 * Get the amount of accounts stored in the database
	 */
	getCount(): Promise<number>;
}

export default IDBConnector;

import fetch from 'node-fetch';

export default class WebhookHelper {
	/**
	 * Send an account to a Discord webhook
	 * @param url The url of the webhook
	 * @param userId The UserId of the account
	 * @param username The username of the account
	 * @param password The password of the account
	 * @param cookie The .ROBLOSECURITY cookie of the account
	 */
	static async sendAccountDiscord(
		url: string,
		userId: string,
		username: string,
		password: string,
		cookie: string
	): Promise<void> {
		const res = await fetch(url, {
			method: 'POST',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify({
				embeds: [
					{
						title: 'ROBLOX Account Created',
						color: 3447003, //https://gist.github.com/thomasbnt/b6f455e2c7d743b796917fa3c205f812
						thumbnail: {
							url: 'https://upload.wikimedia.org/wikipedia/commons/4/48/Roblox_Logo_2021.png'
						},
						fields: [
							{
								name: 'UserId',
								value: userId
							},
							{
								name: 'Username',
								value: username
							},
							{
								name: 'Password',
								value: password
							},
							{
								name: 'Cookie',
								value: cookie
							}
						]
					}
				]
			})
		});

		if (!res.ok) {
			throw new Error(await res.text());
		}
	}
}

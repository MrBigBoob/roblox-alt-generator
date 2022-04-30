import parse from 'node-html-parser';
import fetch, { Response } from 'node-fetch';
import RobloxAccount from './RobloxAccount';
import username from 'username-generator';
import UserAgent from 'random-useragent';
import { randomBirthday, randomGender } from './RobloxRandomizer';
import ProxyManager from '../proxy/ProxyManager';

export default class RobloxUtils {
	static async makeRequest(url: string, options?: any): Promise<Response> {
		const controller = new AbortController();

		let timeout = 10000;
		try {
			if (process.env.REQUEST_TIMEOUT != null)
				timeout = Number.parseInt(process.env.REQUEST_TIMEOUT);
		} catch {}
		const timeoutId = setTimeout(() => {
			controller.abort();
		}, timeout);

		options ??= {};
		options.headers ??= [];

		options.signal = controller.signal;

		if (ProxyManager.isEnabled()) {
			options['agent'] = ProxyManager.getProxyAgent();
		}
		try {
			const res = await fetch(url, options);
			clearTimeout(timeoutId);
			return res;
		} catch (err) {
			ProxyManager.next('Proxied request failed: ' + err.message);
			return await this.makeRequest(url, options);
		}
	}

	/**
	 * Generates a valid ROBLOX CSRF token
	 */
	static async genRegisterCSRF(): Promise<string> {
		const res = await this.makeRequest('https://roblox.com/');
		const txt = await res.text();

		const root = parse(txt);
		const meta = root.querySelector('#rbx-body > meta');

		if (!meta) {
			throw new Error('[❌] Failed to generate CSRF token');
		}

		return meta.rawAttrs.split('"')[3];
	}
	/**
	 * Checks if a username is available
	 */
	static async checkUsername(username: string): Promise<boolean> {
		const url = 'https://auth.roblox.com/v1/usernames/validate';
		const res = await this.makeRequest(url, {
			method: 'POST',
			headers: {
				'User-Agent': UserAgent.getRandom(),
				'x-csrf-token': await this.genRegisterCSRF(),
				'content-type': 'application/json'
			},
			body: JSON.stringify({
				username: username,
				context: 'Signup',
				birthday: '1966-07-08T04:00:00.000Z'
			})
		});

		const json = await res.json();

		return json.code === 0;
	}

	/**
	 * Generates a username
	 */
	static async genUsername(): Promise<string> {
		let usr = username.generateUsername();
		while (!(await this.checkUsername(usr))) {
			usr = username.generateUsername();
		}

		return usr;
	}
	/**
	 * Generates a password
	 */
	static genPassword(): string {
		const letters =
			'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!!!!!!!!!@@@@@@@[[][][]][][];;;;;;;';
		const length = 20;
		let endStr = '';
		for (var i = 0; i < length; i++) {
			endStr += letters[Math.floor(Math.random() * (letters.length - 1))];
		}

		return endStr;
	}
	/**
	 * Gets the field data of ROBLOX
	 */
	static async getFieldData(): Promise<string> {
		try {
			const res = await this.makeRequest(
				'https://auth.roblox.com/v2/signup',
				{
					headers: {
						'user-agent': UserAgent.getRandom(),
						'x-csrf-token': await this.genRegisterCSRF(),
						'content-type': 'application/json'
					},
					body: '{}',
					method: 'POST'
				}
			);

			const jsonText = await res.text();
			const json = JSON.parse(jsonText);
			if (
				!json.failureDetails ||
				json.failureDetails.length === 0 ||
				!json.failureDetails[0].fieldData
			) {
				if (jsonText.includes('TooManyRequests')) {
					ProxyManager.next('Field data ratelimited');
					return await this.getFieldData();
				}

				console.log(`[❌] Failed to get field data! (${jsonText})`);
				return '';
			}

			const fieldData = json.failureDetails[0].fieldData;

			return fieldData;
		} catch (err) {
			if (err.message != '[❌] Failed to generate CSRF token') {
				ProxyManager.next(`Error while getting field data ${err.message}`);
			}
			return await this.getFieldData();
		}
	}
	/**
	 * Creates a ROBLOX account
	 */
	static async createAccount(
		captchaToken: string,
		captchaId: string
	): Promise<RobloxAccount> {
		const username = await this.genUsername();
		const password = this.genPassword();
		const url = 'https://auth.roblox.com/v2/signup';

		const payload = {
			agreementIds: [
				'54d8a8f0-d9c8-4cf3-bd26-0cbf8af0bba3',
				'848d8d8f-0e33-4176-bcd9-aa4e22ae7905'
			],
			birthday: randomBirthday(),
			captchaProvider: 'PROVIDER_ARKOSE_LABS',
			captchaToken: captchaToken,
			context: 'MultiverseSignupForm',
			displayAvatarV2: false,
			displayContextV2: false,
			gender: randomGender(),
			isTosAgreementBoxChecked: true,
			password: password,
			referralDate: null,
			username: username,
			captchaId: captchaId
		};

		const res = await this.makeRequest(url, {
			method: 'POST',
			headers: {
				'user-agent': UserAgent.getRandom(),
				'x-csrf-token': await this.genRegisterCSRF(),
				'content-type': 'application/json'
			},
			body: JSON.stringify(payload)
		});

		if (!res.ok) {
			const txt = await res.text();
			if (txt.includes('TooManyRequests')) {
				ProxyManager.next('Ratelimited');
				return await this.createAccount(captchaToken, captchaId);
			}

			throw new Error('[❌] Failed to create account: ' + txt);
		}

		const json = await res.json();

		const regex =
			/.ROBLOSECURITY=(_\|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.\|_[A-Za-z0-9]+)/g;

		const cookies: string | null = res.headers.get('set-cookie');

		if (cookies == null) {
			throw new Error('[❌] No set-cookie header');
		}

		let cookieMatches = regex.exec(cookies);

		if (cookieMatches == null || cookieMatches.length < 2) {
			throw new Error(
				`[❌] Failed to find a cookie in the response!\n${JSON.stringify(
					json
				)}`
			);
		}

		let cookie = cookieMatches[1].substring(116);

		const account = new RobloxAccount(
			username,
			json.userId,
			password,
			cookie
		);

		return account;
	}
}

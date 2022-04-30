import express from 'express';
import { DBUtil } from '../db/DBUtil';
import RobloxUtils from '../rbx/RobloxUtils';
import WebhookHelper from '../WebhookHelper';
const router = express.Router();

router.use(
	express.json({
		type: '*/*'
	})
);

router.post('/create', async (req, res) => {
	const body = req.body;
	const captcha = body.captcha;
	const captchaId = body.captchaId;

	if (
		!captcha ||
		!captchaId ||
		typeof captcha != 'string' ||
		typeof captchaId != 'string'
	) {
		res.json({ success: false, error: 'Missing captcha' });
		return;
	}

	let account;
	try {
		account = await RobloxUtils.createAccount(captcha, captchaId);
	} catch (err) {
		return res.json({
			success: false,
			userId: 'Failed to create account!'
		});
	}

	// Send account to webhook
	const discordWebhook = process.env.DISCORD_WEBHOOK;

	if (discordWebhook) {
		try {
			WebhookHelper.sendAccountDiscord(
				discordWebhook,
				account.userId,
				account.username,
				account.password,
				account.cookie
			);
		} catch (err) {
			console.log(`[❌] Failed to execute webhook (${err})`);
		}
	}

	await DBUtil.addAccount(
		account.userId,
		account.username,
		account.password,
		account.cookie
	);

	res.json({ success: true, userId: account.userId });
});

router.get('/random', async (_, res) => {
	const account = await DBUtil.getRandomAccount();

	if (account === null) {
		res.json({ success: false, error: 'No accounts found' });
	}

	res.json({ success: true, account });
});

router.get('/', async (_, res) => {
	const accounts = await DBUtil.getAllAccounts();

	res.json({ success: true, accounts });
});

router.get('/count', async (_, res) => {
	const count = await DBUtil.getCount();

	res.json({ success: true, count });
});

export default router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const DBUtil_1 = require("../db/DBUtil");
const RobloxUtils_1 = __importDefault(require("../rbx/RobloxUtils"));
const WebhookHelper_1 = __importDefault(require("../WebhookHelper"));
const router = express_1.default.Router();
router.use(express_1.default.json({
    type: '*/*'
}));
router.post('/create', async (req, res) => {
    const body = req.body;
    const captcha = body.captcha;
    const captchaId = body.captchaId;
    if (!captcha ||
        !captchaId ||
        typeof captcha != 'string' ||
        typeof captchaId != 'string') {
        res.json({ success: false, error: 'Missing captcha' });
        return;
    }
    let account;
    try {
        account = await RobloxUtils_1.default.createAccount(captcha, captchaId);
    }
    catch (err) {
        return res.json({
            success: false,
            userId: 'Failed to create account!'
        });
    }
    // Send account to webhook
    const discordWebhook = process.env.DISCORD_WEBHOOK;
    if (discordWebhook) {
        try {
            WebhookHelper_1.default.sendAccountDiscord(discordWebhook, account.userId, account.username, account.password, account.cookie);
        }
        catch (err) {
            console.log(`[❌] Failed to execute webhook (${err})`);
        }
    }
    await DBUtil_1.DBUtil.addAccount(account.userId, account.username, account.password, account.cookie);
    res.json({ success: true, userId: account.userId });
});
router.get('/random', async (_, res) => {
    const account = await DBUtil_1.DBUtil.getRandomAccount();
    if (account === null) {
        res.json({ success: false, error: 'No accounts found' });
    }
    res.json({ success: true, account });
});
router.get('/', async (_, res) => {
    const accounts = await DBUtil_1.DBUtil.getAllAccounts();
    res.json({ success: true, accounts });
});
router.get('/count', async (_, res) => {
    const count = await DBUtil_1.DBUtil.getCount();
    res.json({ success: true, count });
});
exports.default = router;

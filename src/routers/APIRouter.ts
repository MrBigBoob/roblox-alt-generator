import express from 'express';
import RobloxUtils from '../rbx/RobloxUtils';
import AccountsRouter from './AccountsRouter';
const router = express.Router();

router.use('/accounts', AccountsRouter);

router.get('/field_data', async (_, res) => {
	res.send(await RobloxUtils.getFieldData());
});

router.get('/', (_, res) => {
	res.json({
		success: true,
		repo: 'https://github.com/RbxGen/RobloxGen/'
	});
});

export default router;

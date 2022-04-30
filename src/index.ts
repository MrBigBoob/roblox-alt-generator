import 'dotenv/config';
import express from 'express';
import { DBUtil, connectorType } from './db/DBUtil';
import ProxyManager from './proxy/ProxyManager';
import APIRouter from './routers/APIRouter';

const app = express();

app.use(express.static('web/'));

app.use((_, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	next();
});

app.use('/api', APIRouter);

// Entry point
(async () => {
	// Welcome message
	console.log(
		`
 ____       _     _            ____            
|  _ \\ ___ | |__ | | _____  __/ ___| ___ _ __  
| |_) / _ \\| '_ \\| |/ _ \\ \\/ / |  _ / _ \\ '_ \\ 
|  _ < (_) | |_) | | (_) >  <| |_| |  __/ | | |
|_| \\_\\___/|_.__/|_|\\___/_/\\_\\\\____|\\___|_| |_|

`
	);
	console.log('[➖] Using DB type ' + connectorType);
	if (!(await DBUtil.setupDB())) {
		process.exit();
	}

	// Load proxies
	if (ProxyManager.isEnabled() && !ProxyManager.loadProxies()) {
		process.exit();
	}

	app.listen(process.env.WEB_PORT, () => {
		console.log(
			'[✅] Web app started on http://localhost:' + process.env.WEB_PORT
		);
	});
})();

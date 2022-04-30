"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const DBUtil_1 = require("./db/DBUtil");
const ProxyManager_1 = __importDefault(require("./proxy/ProxyManager"));
const APIRouter_1 = __importDefault(require("./routers/APIRouter"));
const app = (0, express_1.default)();
app.use(express_1.default.static('web/'));
app.use((_, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});
app.use('/api', APIRouter_1.default);
// Entry point
(async () => {
    // Welcome message
    console.log(`
 ____       _     _            ____            
|  _ \\ ___ | |__ | | _____  __/ ___| ___ _ __  
| |_) / _ \\| '_ \\| |/ _ \\ \\/ / |  _ / _ \\ '_ \\ 
|  _ < (_) | |_) | | (_) >  <| |_| |  __/ | | |
|_| \\_\\___/|_.__/|_|\\___/_/\\_\\\\____|\\___|_| |_|

`);
    console.log('[➖] Using DB type ' + DBUtil_1.connectorType);
    if (!(await DBUtil_1.DBUtil.setupDB())) {
        process.exit();
    }
    // Load proxies
    if (ProxyManager_1.default.isEnabled() && !ProxyManager_1.default.loadProxies()) {
        process.exit();
    }
    app.listen(process.env.WEB_PORT, () => {
        console.log('[✅] Web app started on http://localhost:' + process.env.WEB_PORT);
    });
})();

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const https_proxy_agent_1 = require("https-proxy-agent");
class ProxyManager {
    proxies = [];
    index = 0;
    loadProxies() {
        if (!fs_1.default.existsSync('proxies.txt')) {
            console.log('No proxies.txt file found');
            return false;
        }
        const proxiesText = fs_1.default.readFileSync('proxies.txt', 'utf-8');
        for (const proxyLine of proxiesText.split(/\r?\n/)) {
            if (proxyLine) {
                this.proxies.push('http://' + proxyLine);
            }
        }
        if (this.proxies.length === 0) {
            console.log('[❌] No valid proxies found!');
            return false;
        }
        console.log(`[✅] ${this.proxies.length} proxies loaded`);
        return true;
    }
    getProxy() {
        return this.proxies[this.index];
    }
    getProxyAgent() {
        return new https_proxy_agent_1.HttpsProxyAgent(this.getProxy());
    }
    next(reason) {
        if (!this.isEnabled()) {
            console.log('[⚠] ROBLOX request failed but proxies are disabled');
            return;
        }
        this.index++;
        if (this.index > this.proxies.length - 1) {
            this.index = 0;
        }
        console.log(`[-] Rotated proxy (pos ${this.index}) (${this.getProxy()}) (Reason: ${reason})`);
    }
    isEnabled() {
        return process.env.USE_PROXIES === 'true';
    }
}
exports.default = new ProxyManager();

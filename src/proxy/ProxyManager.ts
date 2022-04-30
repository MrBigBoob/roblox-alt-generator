import fs from 'fs';
import { HttpsProxyAgent } from 'https-proxy-agent';
class ProxyManager {
	proxies: string[] = [];
	index: number = 0;

	loadProxies(): boolean {
		if (!fs.existsSync('proxies.txt')) {
			console.log('No proxies.txt file found');
			return false;
		}

		const proxiesText = fs.readFileSync('proxies.txt', 'utf-8');

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

	getProxy(): string {
		return this.proxies[this.index];
	}

    getProxyAgent(): HttpsProxyAgent {
        return new HttpsProxyAgent(this.getProxy());
    }

	next(reason: string): void {
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

	isEnabled(): boolean {
		return process.env.USE_PROXIES === 'true';
	}
}

export default new ProxyManager();

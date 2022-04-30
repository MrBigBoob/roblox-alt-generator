"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vedudb_1 = __importDefault(require("@vedux/vedudb"));
const RobloxAccount_1 = __importDefault(require("../../rbx/RobloxAccount"));
class VeduConnector {
    database;
    async setupDB() {
        try {
            this.database = new vedudb_1.default('database.json');
            console.log(`[✅] Vedu database setup`);
        }
        catch (err) {
            console.log(`[❌] Unexpected vedu error (${err})`);
            return false;
        }
        return true;
    }
    async addAccount(userId, username, password, cookie) {
        try {
            await this.database.set(userId.toString(), {
                username: username,
                userId: userId,
                password: password,
                cookie: cookie
            });
            console.log(`[✅] Account ${username} inserted into the database!`);
        }
        catch (err) {
            console.log('[❌] Error inserting account: ' + err);
        }
    }
    async getRandomAccount() {
        const acc = this.database.random();
        return new RobloxAccount_1.default(acc.username, acc.userId, acc.password, acc.cookie);
    }
    async getAllAccounts() {
        let accounts = [];
        const entries = Object.entries(await this.database.fetchAll());
        for (const [_, user] of entries) {
            accounts.push(new RobloxAccount_1.default(user.username, user.userId, user.password, user.cookie));
        }
        return accounts;
    }
    async getCount() {
        return this.database.count();
    }
}
exports.default = VeduConnector;

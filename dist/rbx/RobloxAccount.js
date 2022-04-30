"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RobloxAccount {
    username;
    userId;
    password;
    cookie;
    constructor(username, userId, password, cookie) {
        this.username = username;
        this.userId = userId;
        this.password = password;
        this.cookie = cookie;
    }
}
exports.default = RobloxAccount;

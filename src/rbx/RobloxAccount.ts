export default class RobloxAccount {
  username;
  userId;
  password;
  cookie;

  constructor(username: string, userId: string, password: string, cookie: string) {
    this.username = username;
    this.userId = userId;
    this.password = password;
    this.cookie = cookie;
  }
}

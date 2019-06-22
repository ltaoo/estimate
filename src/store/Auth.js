import { observable } from 'mobx';

export default class Auth {
  @observable username = ''

  updateLoginUserName(value) {
    this.username = value;
  }

  login() {
    // 连接 socket.io
    this.connect(this.username, 1);
  }

  logout() {
    const { client } = this;
    client.emit('logout');
  }
}

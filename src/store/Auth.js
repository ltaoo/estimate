import Taro from '@tarojs/taro';
import { observable } from 'mobx';

import {
  loginPath,
  hallPath,
} from '../constants/paths'

export default class Auth {
  @observable username = ''

  constructor(global) {
    this.globalStore = global;
  }

  updateLoginUserName(value) {
    this.username = value;
  }

  login() {
    this.globalStore.connect()
      .then((client) => {
        client.emit('login', { username: this.username });
      })
      .catch(() => {});
  }

  logout() {
    const { client } = this.globalStore;
    if (client === null) {
      return;
    }
    client.emit('logout');
  }

  // 一些和 Auth 相关的监听
  addListeners(client) {
    client.on('loginSuccess', ({ user }) => {
      console.log('login success', user.name);
      this.globalStore.user = user;
      Taro.atMessage({
        type: 'success',
        message: '登录成功',
      });
      Taro.setStorageSync('user', user);
      setTimeout(() => {
        Taro.redirectTo({
          url: hallPath,
        });
      }, 500);
    });
    client.on('loginFail', ({ message }) => {
      Taro.atMessage({
        type: 'error',
        message,
      });
    });
    client.on('logoutSuccess', () => {
      Taro.removeStorageSync('user');
      Taro.atMessage({
        type: 'success',
        message: '注销成功',
      });
      setTimeout(() => {
        Taro.redirectTo({
          url: loginPath,
        });
      }, 500);
    });
  }
}

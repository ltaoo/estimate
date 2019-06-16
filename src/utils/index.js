import Taro from '@tarojs/taro';

import { login } from '../constants';

export function checkLogin(store) {
  if (store.user !== undefined) {
    return true;
  }
  return false;
}

export function redirectLogin() {
  Taro.navigateTo({
    url: login,
  });
}

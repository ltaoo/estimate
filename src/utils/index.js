import Taro from '@tarojs/taro';

import { loginPath } from '../constants';

export function checkLogin(store) {
  if (store.user === null || store.user === '') {
    return false;
  }
  return true;
}

export function redirectLogin() {
  Taro.navigateTo({
    url: loginPath,
  });
}

import Taro from '@tarojs/taro';

import { loginPath, offlineErrorPath } from '../constants/paths';

export function checkLogin(store) {
  if (store.user === null || store.user === '') {
    return false;
  }
  return true;
}

export function redirectLogin() {
  Taro.redirectTo({
    url: loginPath,
  });
}

export function redirectOfflineTipPage() {
  Taro.redirectTo({
    url: offlineErrorPath,
  });
}

/**
 * 对输入的用户名进行校验
 * @param {string} username - 要校验的用户名
 * @return {string | undefined}
 */
export function validateUserName (username) {
  if (username === '') {
    return '请输入用户名称';
  }
  if (username && username.length > 5) {
    return '用户名不能超过5个字符';
  }
  return undefined;
}

/**
 * @param {number} time - 休眠的毫秒数
 * @return {Promise}
 */
export function sleep(time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}


export function checkIsAdmintor({ user, room }) {
  let isAdmintor = false;
  if (user === null || room === null || room === undefined) {
    return isAdmintor;
  }
  if (user.createdRoomId === null) {
    return isAdmintor;
  }
  if (room.id === user.createdRoomId) {
    isAdmintor = true;
  }
  return isAdmintor;
}

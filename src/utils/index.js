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

export function isWaitingMembers(user) {
  if (
    user.joinedRoomId !== null
    && user.estimating === false
  ) {
    return true;
  }
  return false;
}

export function isPrepareEstimate(user) {
  if (
    user.estimating === true
    && user.estimate === null
    && user.showResult === false
  ) {
    return true;
  }
  return false;
}

export function isGivedEstimate(user) {
  if (
    user.estimating === true
    && user.estimate !== null
    && user.showResult === false
  ) {
    return true;
  }
  return false;
}

export function isShowEstimateResult(user) {
  if (
    user.estimating === true
    && user.showResult === true
  ) {
    return true;
  }
  return false;
}

export function divideEstimates(estimates) {
  const estimatedMembers = [];
  const unestimatedMembers = [];
  for (let i = 0, l = estimates.length; i < l; i += 1) {
    if (estimates[i].estimate === null) {
      unestimatedMembers.push(estimates[i]);
    } else {
      estimatedMembers.push(estimates[i]);
    }
  }
  return {
    estimatedMembers,
    unestimatedMembers,
  };
}

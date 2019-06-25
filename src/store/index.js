import Taro from '@tarojs/taro';
import io from 'socket.io-client';
import { observable } from 'mobx';

import { socketUrl } from '../constants';
import {
  hallPath,
  offlineEstimatePath,
  inputPath,
  estimatePath,
  userPath,
} from '../constants/paths';
import {
  sleep,
  redirectLogin,
  isPrepareEstimate,
  isGivedEstimate,
  isShowEstimateResult,
} from '../utils';

import HallStore from './Hall';
import AuthStore from './Auth';
import EstimateStore from './Estimate';

function getInitialUser() {
  return {
    name: null,
    uuid: null,
    joinedRoomId: null,
    createdRoomId: null,
    estimate: null,
    estimating: null,
  };
}

function getInitialRoom() {
  return {
    id: null,
    members: [],
    status: 'ENABLE',
  };
}

const PATH_MAP = [
  hallPath,
  offlineEstimatePath,
  userPath,
];

export default class GlobalStore {
  constructor() {
    this.authStore = new AuthStore(this);
    this.hallStore = new HallStore(this);
    this.estimateStore = new EstimateStore(this);
  }

  client = null
  currentPath = null
  @observable initial = true
  // 登录的用户信息
  @observable user = getInitialUser()
  // 应用初始化
  init({ currentPath }) {
    console.log('[type]', 'init', '[payload]', { currentPath });
    this.currentPath = currentPath;
    this.changeTabBarIndex(PATH_MAP.indexOf(currentPath), false);
    // 用户已经初始化
    if (this.client && this.user.uuid) {
      return;
    }
    const cachedUser = Taro.getStorageSync('user');
    // 没有登录
    if (cachedUser === '') {
      redirectLogin();
      return;
    }
    sleep(1000)
      .then(() => {
      })
      .then(() => {
        this.user = cachedUser;
        if (cachedUser && !this.client) {
          // 如果本地存在登录信息，并且还没有连接，就主动连接
          return this.connect();
        }
        return Promise.reject();
      })
      .then((client) => {
        console.log(79, '[client]', 'reconnect', '[payload]', { uuid: cachedUser.uuid });
        client.emit('recover', { uuid: cachedUser.uuid });
      })
      .catch(() => {
        console.log('[normal]', 'connect fail');
        Taro.atMessage({
          type: 'error',
          message: '连接服务失败，请使用离线模式',
        });
      });
  }
  /**
   * 连接服务端
   * @param {string} username - 用户名
   * @param {number} refresh - 是否强制刷新 1 是、0 否
   */
  connect() {
    return new Promise((resolve, reject) => {
      Taro.request({
        url: `${socketUrl}/api/ping`,
        mode: 'cors',
      })
        .then(() => {
          const client = io(socketUrl);
          this.client = client;
          this.addListeners(client);
          resolve(client);
        })
        .catch(() => {
          reject();
        });
    });
  }

  reconnect() {
    this.connect()
      .then((client) => {
        console.log('[client]', 'reconnect', '[payload]', { uuid: this.user.uuid });
        client.emit('recover', { uuid: this.user.uuid });
      })
      .catch(() => {
        console.log('[normal]', 'connect fail');
        Taro.atMessage({
          type: 'error',
          message: '连接服务失败，请使用离线模式',
        });
      });
  }

  /**
   * 注册一些响应处理器
   * @param {Client} client
   */
  addListeners(client) {
    this.hallStore.addListeners(client);
    this.authStore.addListeners(client);
    this.estimateStore.addListeners(client);

    client.on('reconnectSuccess', ({ user, room = getInitialRoom(), rooms }) => {
      console.log('[client]', 'reconnect success', { user, room, rooms });
      this.hallStore.room = room;
      this.hallStore.rooms = rooms;
      this.user = user;
      Taro.setStorageSync('user', user);
      if (user.joinedRoomId === null) {
        return;
      }
      // 加入了房间，先向服务端发起加入房间
      client.emit('joinRoom', { roomId: user.joinedRoomId });
      // 已经开始估时
      if (isPrepareEstimate(user)) {
        console.log('加入房间并且已经开始估时，但自己没有给出估时，到选择点数页');
        Taro.navigateTo({
          url: inputPath,
        });
        return;
      }
      if (isGivedEstimate(user)) {
        console.log('加入房间并且已经开始估时，自己给出了估时，到展示点数页');

        client.emit('estimate', { value: user.estimate });
        if (this.currentPath !== estimatePath) {
          Taro.navigateTo({
            url: estimatePath,
          });
        }
        return;
      }
      // 估时完成
      if (isShowEstimateResult(user)) {
        console.log('加入房间并且已经展示结果');
        // 但是这里可能当组长「重新开始估时」之前，退出了再重登，就刚好状态一直是 showResult = true
        // 只能返回房间再开始估时，中途不能退出，或者增加 emit('resetShowResultStatus') 让服务端重置
        client.emit('showEstimateResult');
        return;
      }
    });
    client.on('reconnectFail', ({ message }) => {
      console.log('[client]', 'recover fail', message);
      Taro.showModal({
        title: '登录失败',
        content: '登录信息已过期，请重新登录',
        showCancel: false,
      })
        .then(() => {
          redirectLogin();
        });
    });

    client.on('disconnect', () => {
      console.log('和服务器断开连接');
    });

    // 错误
    client.on('err', ({ message, type }) => {
      console.log('服务端错误', type, message);
      Taro.atMessage({
        type: 'error',
        message,
      });
    });
  }

  switchOfflineMode() {
    this.changeTabBarIndex(1);
    Taro.navigateTo({
      url: offlineEstimatePath,
    });
  }

  currentTabBarIndex = 0
  /**
   * 切换页面底部 tabbar
   * @param {string|number} index - 下标或者 path
   * @param {boolean} [redirect=true] - 是否跳转至页面
   */
  changeTabBarIndex(index, redirect = true) {
    let nextIndex = index;
    if (typeof index === 'string') {
      nextIndex = PATH_MAP.indexOf(index);
    }
    if (nextIndex === this.currentTabBarIndex) {
      return;
    }
    this.currentTabBarIndex = nextIndex;
    if (redirect === false) {
      return;
    }
    Taro.navigateTo({
      url: PATH_MAP[nextIndex],
    });
  }
  setInitial() {
    this.initial = false
  }
  resetInitial() {
    this.initial = true;
  }
}

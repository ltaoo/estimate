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
} from '../utils';
import Hall from './Hall';
import Auth from './Auth';
import Estimate from './Estimate';

function getInitialUser() {
  return {
    name: null,
    joinedRoomId: null,
    createdRoomId: null,
    estimate: null,
    estimating: null,
  };
}

const PATH_MAP = [
  hallPath,
  offlineEstimatePath,
  userPath,
];

export default class GlobalStore {
  constructor() {
    this.hallStore = new Hall(this);
    this.authStore = new Auth(this);
    this.estimateStore = new Estimate(this);
  }

  @observable initial = true
  @observable loading = true
  @observable client = null
  // 登录的用户信息
  @observable user = getInitialUser()
  // 应用初始化
  init() {
    this.loading = true;
    const currentPath = Taro.getCurrentPages()[0].$router.path;
    this.changeTabBarIndex(PATH_MAP.indexOf(currentPath));
    // 用户已经初始化
    if (this.user && this.client) {
      return;
    }
    const cachedUser = Taro.getStorageSync('user');
    // 没有登录
    if (cachedUser === '') {
      redirectLogin();
      return;
    }
    Taro.showLoading({
      title: '加载数据中...'
    })
      .then(() => {
        return sleep(1000);
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
        console.log('client emit recover event');
        client.emit('recover', { username: cachedUser.uuid });
      })
      .catch(() => {
        // redirectOfflineTipPage();
        console.log('connect fail');
        // this.offlineMode = true;
        Taro.atMessage({
          type: 'error',
          message: '连接服务失败，请使用离线模式',
        });
      })
      .finally(() => {
        Taro.hideLoading();
        // this.loading = false;
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
          this.client = io(socketUrl);
          this.addListeners(this.client);
          resolve(this.client);
        })
        .catch(() => {
          // this.offlineMode = true;
          reject();
        });
    });
  }

  reconnect() {
  }

  addListeners(client) {
    const {
      authStore,
      hallStore,
      estimateStore,
    } = this;
    hallStore.addListeners(client);
    authStore.addListeners(client);
    estimateStore.addListeners(client);

    client.on('recoverSuccess', ({ user, room, rooms }) => {
      console.log('recover success', user, rooms);
      this.hallStore.rooms = rooms;
      this.hallStore.room = room;
      this.globalStore.user = user;
      Taro.setStorageSync('user', user);
      if (user.joinedRoomId === null) {
        return;
      }
      // 只要加入了房间，就先向服务端发起加入房间
      console.log('加入房间，但是还没开始估时');
      client.emit('joinRoom', { roomId: user.joinedRoomId });
      // 已经开始估时
      if (
        user.estimating === true
        && user.estimate === null
        && user.showResult === false
      ) {
        console.log('加入房间并且已经开始估时，但自己没有给出估时，到选择点数页');
        // client.emit('backEstimate');
        Taro.navigateTo({
          url: inputPath,
        });
        return;
      }
      if (
        user.estimating === true
        && user.estimate !== null
        && user.showResult === false
      ) {
        console.log('加入房间并且已经开始估时，自己给出了估时，到展示点数页');
        // client.emit('backEstimate');
        Taro.navigateTo({
          url: estimatePath,
        });
        return;
      }
      // 估时完成
      if (
        user.showResult === true
      ) {
        console.log('加入房间并且已经展示结果');
        client.emit('showEstimateResult');
        // client.emit('backShowResult');
        // Taro.navigateTo({
        //   url: estimatePath,
        // });
        return;
      }
    });
    client.on('recoverFail', ({ message }) => {
      console.log('recover fail', message);
      Taro.showModal({
        title: '登录失败',
        content: '登录信息失效，请重新登录',
        showCancel: false,
      })
        .then(() => {
          redirectLogin();
        });
    });

    // 错误
    client.on('err', ({ message, type }) => {
      console.log('服务端错误', type, message);
      Taro.atMessage({
        type: 'error',
        message: message,
      });
    });
    client.on('disconnect', () => {
      console.log('和服务器断开连接，请点击重连');
    });
  }

  switchOfflineMode() {
    this.changeTabBarIndex(1);
    // this.offlineModel = true;
    Taro.navigateTo({
      url: offlineEstimatePath,
    });
  }

  currentTabBarIndex = 0
  /**
   *
   * @param {string|number} index - 下标或者 path
   */
  changeTabBarIndex(index) {
    let nextIndex = index;
    if (typeof index === 'string') {
      nextIndex = PATH_MAP.indexOf(index);
    }
    if (nextIndex === this.currentTabBarIndex) {
      return;
    }
    this.currentTabBarIndex = nextIndex;
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

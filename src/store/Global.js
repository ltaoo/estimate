import Taro from '@tarojs/taro';
import io from 'socket.io-client';
import { observable } from 'mobx';

import { socketUrl } from '../constants';
import {
  // loginPath,
  hallPath,
  // roomPath,
  // inputPath,
  // resultPath,
  offlineEstimatePath,
  userPath,
} from '../constants/paths';
import {
  sleep,
  // redirectOfflineTipPage,
  redirectLogin,
} from '../utils';
import Hall from './Hall';
import Auth from './Auth';

// function getInitialRoom() {
//   return {
//     id: null,
//     members: [],
//   };
// }

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
  }

  @observable initial = true
  @observable loading = true
  // 当前是否离线
  offlineMode = false
  client = null
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
        client.emit('recover', { user: cachedUser });
      })
      .catch(() => {
        // redirectOfflineTipPage();
        console.log('connect fail');
        this.offlineMode = true;
        Taro.atMessage({
          type: 'error',
          message: '连接服务失败',
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
          this.offlineMode = true;
          reject();
        });
    });
  }

  reconnect() {
    const { user } = this;
    this.loading = true;
    // 为了不让页面看起来奇怪，延迟 500 毫秒展示出 loading 后再真实请求接口
    sleep(500)
      .then(() => {
        return Taro.request({
          url: `${socketUrl}/api/ping`,
          mode: 'cors',
        });
      })
      .then(() => {
        this.client = io(`${socketUrl}?username=${user.name}`);
        this.addListeners();
      })
      .catch(() => {
        Taro.atMessage({
          type: 'error',
          message: '连接失败，请使用离线模式',
        });
      })
      .finally(() => {
        this.loading = false;
      });
  }

  addListeners(client) {
    client.on('recoverSuccess', ({ user, rooms }) => {
      console.log('recover success', user);
      this.hallStore.rooms = rooms;
      this.user = user;
      if (user.joinedRoomId !== null) {
        client.emit('joinRoom', { id: user.joinedRoomId });
      }
    });
    client.on('recoverFail', () => {
      console.log('recover fail');
      // Taro.atMessage({

      // });
    });
    client.on('createRoomSuccess', ({ user, room }) => {
      console.log('create room success');
      this.user = user;
      this.room = room;
    });
    client.on('joinRoomSuccess', ({ user, room }) => {
      console.log(`${user.name} join room, now member of room is`, room);
      this.room = room;
      Taro.atMessage({
        type: 'info',
        message: `${user.name} 加入了房间`,
      });

      // Taro.navigateTo({
      //   url: roomPath,
      // });
    });
    client.on('leaveRoom', ({ user, room }) => {
      console.log(`${user.name} leave room`, room.members);
      // this.user = user;
      this.room = room;
      Taro.atMessage({
        type: 'info',
        message: `${user.name} 离开了房间`,
      });
    });
    client.on('updateRooms', ({ rooms }) => {
      this.rooms = rooms;
    });
    client.on('startEstimate', () => {
      // Taro.navigateTo({
      //   url: inputPath,
      // });
    });
    client.on('estimate', ({ user, room }) => {
      console.log(`${user.name} give estimate`);
      this.room = room;
    });
    client.on('showEstimate', () => {
      this.showEstimate = true;
    });
    client.on('showEstimateResultSuccess', () => {
      // Taro.navigateTo({
      //   url: resultPath,
      // });
    });
    client.on('restartEstimateSuccess', () => {
      console.log('restartEstimate');
      this.estimate = undefined;
      this.user.estimate = null;
      this.showEstimate = false;
      // Taro.redirectTo({
      //   url: inputPath,
      // });
    });
    client.on('stopEstimateSuccess', () => {
      console.log('stop estimate');
      this.estimate = undefined;
      this.user.estimate = null;
      this.user.estimating = true;
      this.user.joinedRoomId = null;
      this.user.createdRoomId = null;
      Taro.setStorageSync('user', this.user);
      this.showEstimate = false;
      // Taro.redirectTo({
      //   url: hallPath,
      // });
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
    this.offlineModel = true;
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
}

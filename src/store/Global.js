import Taro from '@tarojs/taro';
import io from 'socket.io-client';
import { observable } from 'mobx';

import { socketUrl } from '../constants';
import {
  // loginPath,
  hallPath,
  roomPath,
  // inputPath,
  // resultPath,
  offlineEstimatePath,
  userPath,
} from '../constants/paths';
import { sleep, redirectOfflineTipPage } from '../utils';
import Hall from './Hall';
import Auth from './Auth';

function getInitialRoom() {
  return {
    id: null,
    members: [],
  };
}

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

  // 当前是否离线
  offlineMode = false
  client = null
  // 登录的用户信息
  @observable user = getInitialUser()
  // 应用初始化
  init() {
    const currentPath = Taro.getCurrentPages()[0].$router.path;
    this.changeTabBarIndex(PATH_MAP.indexOf(currentPath));
    // 用户已经初始化
    if (this.user && this.client) {
      return;
    }
    Taro.showLoading({
      title: 'loading'
    })
      .then(() => {
        return sleep(1000);
      })
      .then(() => {
        const cachedUser = Taro.getStorageSync('user');
        if (cachedUser && !this.client) {
          // 如果本地存在登录信息，并且还没有连接，就主动连接
          this.connect(cachedUser.name);
        }
        this.user = cachedUser;
        Taro.hideLoading();
      });
  }
  /**
   * 连接服务端
   * @param {string} username - 用户名
   * @param {number} refresh - 是否强制刷新 1 是、0 否
   */
  connect(username, refresh) {
    Taro.request({
      url: `${socketUrl}/api/ping`,
      mode: 'cors',
    })
      .then((res) => {
        console.log(res);
        this.client = io(`${socketUrl}?username=${username}&refresh=${refresh}`);
        this.addListeners();
      })
      .catch((err) => {
        console.log(err);
        this.offlineMode = true;
        redirectOfflineTipPage();
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

  addListeners() {
    const { client, user } = this;
    client.on('recoverSuccess', ({ room = getInitialRoom() }) => {
      console.log('recover from localstorage', user, room);
      if (user.joinedRoomId === null) {
        // Taro.redirectTo({
        //   url: hallPath,
        // });
        return;
      }
      this.user = user;
      this.room = room;
      const currentPath = Taro.getCurrentPages()[0].$router.path;
      if (
        user
        && user.joinedRoomId
        && user.estimating === false
        && currentPath !== roomPath
      ) {
        // Taro.redirectTo({
        //   url: roomPath,
        // });
      }
    });
    client.on('loginSuccess', () => {
      console.log('login success', user.name);
      this.user = user;
      Taro.atMessage({
        type: 'success',
        message: '登录成功',
      });
      Taro.setStorageSync('user', user);
      // setTimeout(() => {
      //   Taro.redirectTo({
      //     url: hallPath,
      //   });
      // }, 800);
    });
    client.on('logoutSuccess', () => {
      Taro.removeStorageSync('user');
      Taro.atMessage({
        type: 'success',
        message: '注销成功',
      });
      // setTimeout(() => {
      //   Taro.redirectTo({
      //     url: loginPath,
      //   });
      // }, 800);
    });
    // 初始化监听
    client.on('newConnection', () => {
      // 已经在房间，就不提示有谁进入了大厅
      if (this.inRoom) {
        return;
      }
      Taro.atMessage({
        type: 'info',
        message: `${user.name} 进入了大厅`,
      });
    });
    client.on('getRooms', ({ rooms }) => {
      this.rooms = rooms;
    });
    client.on('createRoomSuccess', ({ room }) => {
      console.log('create room success');
      this.user = user;
      this.room = room;
    });
    client.on('joinRoomSuccess', ({ room }) => {
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
    client.on('leaveRoom', ({ room }) => {
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
    client.on('estimate', ({ room }) => {
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

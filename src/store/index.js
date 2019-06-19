import Taro from '@tarojs/taro';
import { observable } from 'mobx';

import User from '../domain/User';
import {
  socketUrl,
  home,
  loginPath,
  hallPath,
  roomPath,
  inputPath,
  resultPath,
  estimatePath,
  offlineEstimatePath,
  userPath,
} from '../constants';

function getInitialRoom() {
  const initialRoom = {
    id: null,
    members: [],
  };
  return initialRoom;
}

const PATH_MAP = [
  hallPath,
  offlineEstimatePath,
  userPath,
];
const user = Taro.getStorageSync('user');

export default observable({
  init() {
    const { user, client } = this;
    if (user && !client) {
      // 如果本地存在登录信息，并且还没有连接，就主动连接
      this.connect(user.name);
    }
  },
  // client
  client: null,
  room: getInitialRoom(),
  rooms: [],
  /**
   * 连接服务端
   * @param {string} username - 用户名
   * @param {number} refresh - 是否刷新
   */
  connect(username, refresh) {
    this.client = io(`${socketUrl}?username=${username}&refresh=${refresh}`);
    this.addListeners();
  },
  addListeners() {
    const { client } = this;
    client.on('recoverSuccess', ({ user, room }) => {
      console.log('recover from localstorage', user, room);
      if (user.joinedRoomId === null) {
        Taro.redirectTo({
          url: hallPath,
        });
        return;
      }
      this.user = user;
      this.room = room;
      const currentPath = Taro.getCurrentPages()[0].$router.path;
      if (
        user.joinedRoomId
        && user.estimating === false
        && currentPath !== roomPath
      ) {
        Taro.redirectTo({
          url: roomPath,
        });
      }
    });
    client.on('loginSuccess', ({ user }) => {
      console.log('login success', user.name);
      this.user = user;
      Taro.atMessage({
        type: 'success',
        message: '登录成功',
      });
      Taro.setStorageSync('user', user);
      setTimeout(() => {
        Taro.redirectTo({
          url: hallPath,
        });
      }, 800);
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
      }, 800);
    });
    // 初始化监听
    client.on('newConnection', ({ global, user }) => {
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

      Taro.navigateTo({
        url: roomPath,
      });
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
      Taro.navigateTo({
        url: inputPath,
      });
    });
    client.on('estimate', ({ user, room }) => {
      console.log(`${user.name} give estimate`);
      this.room = room;
    });
    client.on('showEstimate', () => {
      this.showEstimate = true;
    });
    client.on('showEstimateResultSuccess', () => {
      Taro.navigateTo({
        url: resultPath,
      });
    });
    client.on('restartEstimateSuccess', () => {
      console.log('restartEstimate');
      this.estimate = undefined;
      this.user.estimate = null;
      this.showEstimate = false;
      Taro.redirectTo({
        url: inputPath,
      });
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
      Taro.redirectTo({
        url: hallPath,
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
  },

  // username
  user,
  username: undefined,
  saveUsername(value) {
    this.username = value;
  },
  login() {
    const { username } = this;
    // 连接 socket.io
    try {
      this.connect(username, 1);
    } catch (err) {
      console.log(err);
    }
  },
  logout() {
    const { client } = this;
    client.emit('logout');
  },
  // room
  roomId: undefined,
  inRoom: false,
  users: [],
  createRoom() {
    if (!this.client) {
      console.log('还未连接 socket ');
      return;
    }
    this.client.emit('createRoom');
  },
  updateRoomId(value) {
    this.roomId = value;
  },
  joinRoom(id) {
    const roomId = id || this.roomId;
    this.client.emit('joinRoom', { roomId });
  },
  leaveRoom() {
    const { client, username, roomId } = this;
    client.emit('leaveRoom', { roomId });
  },

  // estimate
  estimate: undefined,
  estimates: [],
  showEstimate: false,
  startEstimate() {
    const { client, roomId } = this;
    this.showEstimate = false;
    client.emit('startEstimate', { roomId });
  },
  updateEstimate(value) {
    this.estimate = value;
    const { client } = this;
    client.emit('estimate', { value });
    Taro.navigateTo({
      url: estimatePath,
    });
  },
  showEstimateResult() {
    const { client } = this;
    client.emit('showEstimateResult');
  },
  restartEstimate() {
    const { client } = this;
    client.emit('restartEstimate');
  },
  stopEstimate() {
    this.client.emit('stopEstimate');
  },

  isAdmintor() {
    const { user, room } = this;
    let isAdmintor = false;
    if (room.id !== null && (room.id === user.createdRoomId)) {
      isAdmintor = true;
    }
    return isAdmintor;
  },
  currentTabBarIndex: 0,
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
  },
});

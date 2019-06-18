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
    client.on('recoverSuccess', ({ user }) => {
      console.log('recover from localstorage', user.name);
      const { joinedRoomId } = user;
      this.joinRoom(joinedRoomId);
    });
    client.on('loginSuccess', ({ user }) => {
      console.log('login success', user.name);
      this.user = user;
      Taro.redirectTo({
        url: hallPath,
      });
      Taro.setStorageSync('user', user);
    });
    client.on('logoutSuccess', () => {
      Taro.setStorageSync('user', null);
      Taro.redirectTo({
        url: loginPath,
      });
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
    client.on('createRoomSuccess', ({ rooms }) => {
      console.log('create room success');
      this.rooms = rooms;
    });
    client.on('joinRoomSuccess', ({ roomId, user, users }) => {
      console.log(`${user.name} join room, now member of room is`, users);
      this.user = user;
      Taro.setStorageSync('user', user);
      this.users = users;
      this.inRoom = true;
      this.roomId = roomId;
      Taro.atMessage({
        type: 'info',
        message: `${user.name} 加入了房间`,
      });
    });
    client.on('leaveRoom', ({ user, users }) => {
      console.log(`${user.name} leave room`, users);
      Taro.atMessage({
        type: 'info',
        message: `${user.name} 离开了房间`,
      });
      this.users = users;
    });
    client.on('updateRooms', ({ rooms }) => {
      this.rooms = rooms;
    });
    client.on('startEstimate', () => {
      Taro.navigateTo({
        url: inputPath,
      });
    });
    client.on('estimate', ({ user, estimates }) => {
      console.log(`${user.username} give estimate`, estimates);
      this.estimates = estimates;
    });
    client.on('showEstimate', () => {
      this.showEstimate = true;
    });
    client.on('showResult', () => {
      Taro.navigateTo({
        url: resultPath,
      });
    });
    client.on('restartEstimate', () => {
      this.estimate = undefined;
      this.estimates = [];
      this.showEstimate = false;
      Taro.navigateTo({
        url: inputPath,
      });
    });
    // 错误
    client.on('err', ({ message }) => {
      console.log('服务端错误', message);
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
    const { roomId } = this;
    let action = 'estimate'
    // if (estimate !== undefined) {
    //   action = 'updateEstimate';
    // }
    client.emit(action, { value, roomId });
    Taro.navigateTo({
      url: estimatePath,
    });
  },

  isAdmintor() {
    const { roomId, user, users } = this;
    const owner = users.find(user => user.isAdmintor);
    let isAdmintor = false;
    if (
      owner
      && owner.name === user.name
      && owner.createdRoomId === roomId
    ) {
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

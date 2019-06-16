import Taro from '@tarojs/taro';
import { observable } from 'mobx';

import User from '../domain/User';
import {
  socketUrl,
  home,
  hallPath,
  roomPath,
  inputPath,
  resultPath,
  estimatePath,
} from '../constants';

const user = Taro.getStorageSync('user');

export default observable({
  init() {
    const { user, client } = this;
    if (user && !client) {
      this.connect(user.name);
    }
  },
  // client
  client: null,
  rooms: [],
  connect(username) {
    this.client = io(`${socketUrl}?username=${username}`);
    this.addListeners();
  },
  addListeners() {
    const { client } = this;
    client.on('recover', ({ user }) => {
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
    // 初始化监听
    client.on('joinRoom', ({ roomId, user, users }) => {
      console.log(`${user.name} join room, now member of room is`, users);
      this.user = user;
      Taro.setStorageSync('user', user);
      this.users = users;
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
      console.log('error', message);
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
      this.connect(username);
    } catch (err) {
      console.log(err);
    }
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
    this.client.emit('createRoom', {}, ({ roomId }) => {
      console.log('created room', roomId);
      this.roomId = roomId;
      Taro.navigateTo({
        url: roomPath,
      });
    });
  },
  updateRoomId(value) {
    this.roomId = value;
  },
  joinRoom(id) {
    const roomId = id || this.roomId;
    this.inRoom = true;
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
});

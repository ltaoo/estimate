import Taro from '@tarojs/taro';
import { observable } from 'mobx';

import {
  socketUrl,
  home,
  roomPath,
  inputPath,
  resultPath,
} from '../constants';

export default observable({
  // client
  client: null,
  connect() {
    const { username } = this;
    // 连接 socket.io
    const client = io(`${socketUrl}?username=${username}`);
    this.createClient(client);
  },
  createClient(client) {
    this.client = client;
    client.on('newConnection', ({ user }) => {
      // 已经在房间，就不提示有谁进入了大厅
      if (this.inRoom) {
        return;
      }
      Taro.atMessage({
        type: 'info',
        message: `${user.name} 进入了大厅`,
      });
    });
    // 初始化监听
    client.on('joinRoom', ({ roomId, user, users }) => {
      console.log(`${user.name} join room, now member of room is`, users);
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
      this.leaveRoom(user, users);
    });
    client.on('startEstimate', () => {
      Taro.redirectTo({
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
      Taro.redirectTo({
        url: resultPath,
      });
    });
    client.on('restartEstimate', () => {
      this.estimate = undefined;
      this.estimates = [];
      this.showEstimate = false;
      Taro.redirectTo({
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
  username: undefined,
  saveUsername(value) {
    this.username = value;
  },

  // room
  roomId: undefined,
  inRoom: false,
  users: [],
  createRoom() {
    this.client.emit('createRoom', {}, ({ roomId }) => {
      console.log('created room', roomId);
      this.roomId = roomId;
      Taro.redirectTo({
        url: roomPath,
      });
    });
  },
  updateRoomId(value) {
    this.roomId = value;
  },
  joinRoom(user, users) {
    const roomId = this.roomId;
    this.inRoom = true;
    this.client.emit('joinRoom', { roomId });
  },
  leaveRoom(user, users) {
    this.users = users;
  },

  // estimate
  estimate: undefined,
  estimates: [],
  showEstimate: false,
  startEstimate() {
    this.showEstimate = false;
  },
  updateEstimate(value) {
    console.log(this);
    this.estimate = value;
  },

  isAdmintor() {
    const { roomId, username, users } = this;
    const owner = users.find(user => user.isAdmintor);
    let isAdmintor = false;
    if (
      owner
      && owner.name === username
      && owner.createdRoomId === roomId
    ) {
      isAdmintor = true;
    }
    return isAdmintor;
  },
});

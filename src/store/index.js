import Taro from '@tarojs/taro';
import { observable } from 'mobx';

import { home, resultPath } from '../constants';

export default observable({
  // client
  client: null,
  createClient(client) {
    this.client = client;

    // 初始化监听
    client.on('joinRoom', ({ user, users }) => {
      console.log(`${user.username} join room, now member of room is`, users);
      // this.joinRoom(user, users);
      this.users = users;
    });
    client.on('leaveRoom', ({ user }) => {
      this.leaveRoom(user);
    });
    client.on('estimate', ({ user, estimates }) => {
      console.log(`${user.username} give estimate`, estimates);
      // this.joinRoom(user, users);
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
        url: home,
      });
    });
    // 错误
    client.on('err', ({ message }) => {
      console.log('error', message);
    });
  },

  // username
  username: undefined,
  saveUsername(value) {
    this.username = value;
  },

  // room
  roomId: undefined,
  users: [],
  createRoom({ roomId, users }) {
    this.roomId = roomId;
    this.users = users;
  },
  updateRoomId(value) {
    this.roomId = value;
  },
  joinRoom(user, users) {
    console.log('call join room', user, users);
    // this.users.push(user);
    this.users = users;
  },
  leaveRoom(user) {
    this.users = this.users.filter(user => user.username !== user.username);
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
});

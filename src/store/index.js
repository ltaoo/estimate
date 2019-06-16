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

export default observable({
  init(data) {
    const { user } = data;
    this.user = user;
  },
  // client
  client: null,
  rooms: [],
  addListeners() {
    const { client } = this;
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

    client.on('getRooms', ({ rooms }) => {
      this.rooms = rooms;
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
  username: undefined,
  saveUsername(value) {
    this.username = value;
  },
  login() {
    const { username } = this;
    // 连接 socket.io
    try {
      const client = io(`${socketUrl}?username=${username}`);
      this.client = client;
      this.addListeners();
      const user = new User({
        id: client.id,
        name: username,
      });
      this.user = user;
      return user;
    } catch (err) {
      console.log(err);
      return null;
    }
  },
  // room
  roomId: undefined,
  inRoom: false,
  users: [],
  createRoom() {
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

import Taro from '@tarojs/taro';
import { observable } from 'mobx';
import { roomPath } from '../constants/paths';

function initialRoom() {
  return {
    id: undefined,
    members: [],
  };
}

export default class Hall {
  @observable inputedRoomId = ''
  @observable room = initialRoom()
  @observable rooms = []

  constructor(global) {
    this.globalStore = global;
  }

  updateRoomId(value) {
    this.inputedRoomId = value;
  }

  createRoom() {
    const { client } = this.globalStore;
    if (!client) {
      console.log('还未连接 socket ');
      return;
    }
    client.emit('createRoom');
  }

  joinRoom(id) {
    const { client } = this.globalStore;
    client.emit('joinRoom', { roomId: id });
  }

  leaveRoom() {
    const { client } = this.globalStore;
    client.emit('leaveRoom');
  }

  backToRoom() {
    Taro.navigateTo({
      url: roomPath,
    });
  }

  addListeners(client) {
    client.on('createRoomSuccess', ({ user, room }) => {
      console.log('create room success');
      this.user = user;
      Taro.setStorageSync('user', user);
      this.room = room;
    });
    client.on('globalCreateRoomSuccess', ({ rooms }) => {
      this.rooms = rooms;
    });
    client.on('joinRoomSuccess', ({ user, room }) => {
      console.log(`${user.name} join room, now member of room is`, room);
      this.room = room;
      Taro.atMessage({
        type: 'info',
        message: `${user.name} 加入了房间`,
      });
      Taro.navigateTo({
        url: `${roomPath}?id=${room.id}`,
      });
    });
    client.on('globalJoinRoomSuccess', ({ user, room }) => {
      console.log('other people join room success', user);
      Taro.atMessage({
        type: 'success',
        message: `${user.name} 加入了房间`,
      });
      this.room = room;
    });
    client.on('joinRoomFail', ({ message }) => {
      Taro.atMessage({
        type: 'error',
        message,
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
  }
}
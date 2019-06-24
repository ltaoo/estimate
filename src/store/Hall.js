import Taro from '@tarojs/taro';
import { observable } from 'mobx';
import { roomPath } from '../constants/paths';
import { isWaitingMembers } from '../utils';

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
    if (client === null) {
      return;
    }
    client.emit('createRoom');
  }

  joinRoom(id) {
    const { client } = this.globalStore;
    if (client === null) {
      return;
    }
    client.emit('joinRoom', { roomId: id });
  }

  leaveRoom() {
    const { client } = this.globalStore;
    if (client === null) {
      return;
    }
    client.emit('leaveRoom');
  }

  backToRoom() {
    Taro.navigateTo({
      url: roomPath,
    });
  }

  startEstimate() {
    const { client } = this.globalStore;
    if (client === null) {
      return;
    }
    client.emit('startEstimate');
  }

  addListeners(client) {
    client.on('createRoomSuccess', ({ user, room }) => {
      console.log('create room success', user, room);
      this.globalStore.user = user;
      this.room = room;
    });
    client.on('globalCreateRoomSuccess', ({ rooms }) => {
      this.rooms = rooms;
    });
    client.on('joinRoomSuccess', ({ user, room }) => {
      this.globalStore.user = user;
      Taro.setStorageSync('user', user);
      // 检查现在是不是已经在房间页面，如果是就不跳转
      if (isWaitingMembers(user) && this.globalStore.currentPath !== roomPath) {
        console.log('after join room success and navigate to room page');
        Taro.navigateTo({
          url: `${roomPath}?id=${room.id}`,
        });
      }
    });
    client.on('globalJoinRoomSuccess', ({ user, room }) => {
      console.log(`${user.name} join room success`);
      Taro.atMessage({
        type: 'success',
        message: `${user.name} 加入了房间`,
      });
      this.room = room;
    });
    client.on('joinRoomFail', ({ message }) => {
      console.log('join room fail', message);
      Taro.atMessage({
        type: 'error',
        message,
      });
    });
    client.on('leaveRoomSuccess', ({ user, room }) => {
      console.log(`${user.name} leave room`, room.members);
      this.globalStore.user = user;
      this.room = room;
    });
    client.on('globalLeaveRoomSuccess', ({ user, room }) => {
      Taro.atMessage({
        type: 'info',
        message: `${user.name} 离开了房间`,
      });
      this.room = room;
    });
    client.on('updateRooms', ({ rooms }) => {
      this.rooms = rooms;
    });
  }
}

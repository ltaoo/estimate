import { observable } from 'mobx';

export default class Hall {
  @observable inputedRoomId = ''
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
}

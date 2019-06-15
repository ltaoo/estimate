import { observable } from 'mobx';

export default observable({
  // client
  client: null,
  createClient(client) {
    this.client = client;
  },

  // username
  username: undefined,
  saveUsername(value) {
    this.username = value;
  },

  // room
  roomId: undefined,
  createRoom(roomId) {
    this.roomId = roomId;
  },
  updateRoomId(value) {
    this.roomId = value;
  },
});

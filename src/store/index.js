import { observable } from 'mobx';

export default observable({
  // client
  client: null,
  createClient(client) {
    this.client = client;

    // 初始化监听
    client.on('joinRoom', ({ user, users }) => {
      this.joinRoom(user);
    });
    client.on('leaveRoom', ({ user }) => {
      this.leaveRoom(user);
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
  joinRoom(user) {
    this.users.push(user);
  },
  leaveRoom(user) {
    this.users = this.users.filter(user => user.username !== user.username);
  },
});

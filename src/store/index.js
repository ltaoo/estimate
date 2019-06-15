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
});

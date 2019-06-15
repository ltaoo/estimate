import Taro, { Component } from '@tarojs/taro';
import {
  View,
  Text,
  Button,
} from '@tarojs/components';
import {
  AtInput,
  AtMessage,
} from 'taro-ui';
import { observer, inject } from '@tarojs/mobx';

import { socketUrl, room } from '../../constants';
import { checkLogin, redirectLogin } from '../../utils';

@inject('global')
@observer
export default class Hall extends Component {
  /**
   * 进入该页面，就是连接的服务器端，可以向全局广播「某某加入大厅」
   */
  componentDidMount() {
    const { global } = this.props;
    const { username } = global;

    if (!checkLogin(global)) {
      redirectLogin();
      return;
    }
    this.connect(username);
  }

  connect = (username) => {
    const { global } = this.props;
    // 连接 socket.io
    const client = io(`${socketUrl}?username=${username}`);
    global.createClient(client);

    client.on('global', this.handleGlobalEvent);

    client.on('joinRoom', this.handleNewUserJoinToRoom);

    client.on('estimate', this.getEstimate);

    client.on('disconnect', () => {
      console.log('和服务器断开连接，请点击重连');
    });
  }

  /**
   * 加入房间，就是指连接到服务器
   */
  createRoom = () => {
    const { global } = this.props;
    const { client } = global;
    client.emit('createRoom', {}, ({ users, roomId }) => {
      console.log('created room', roomId);
      global.createRoom({ roomId, users });
      Taro.navigateTo({
        url: room,
      });
    });
  }

  handleRoomIdChange = (value) => {
    const { global } = this.props;
    global.updateRoomId(value);
  }

  joinRoom = () => {
    const { global: { client, roomId } } = this.props;
    if (roomId === undefined) {
      Taro.atMessage({
        type: 'error',
        message: '请输入用户名称',
      });
      return;
    }
    client.emit('joinRoom', { roomId }, (err) => {
      if (err) {
        console.log(err);
        return;
      }
      // 跳转到房间
      Taro.navigateTo({
        url: room,
      });
    });
  }

  render() {
    const { global: { username } } = this.props;
    return (
      <View className="hall-page">
        <Text>欢迎: {username}</Text>
        <Button onClick={this.createRoom}>创建房间</Button>
        <AtInput placeholder="请输入房间号" onChange={this.handleRoomIdChange} />
        <Button type="primary" onClick={this.joinRoom}>进入房间</Button>
        <AtMessage />
      </View>
    );
  }
}


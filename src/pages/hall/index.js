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

import { socketUrl, room, home } from '../../constants';
import { checkLogin, redirectLogin } from '../../utils';

import './index.less';

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
  }

  /**
   * 加入房间，就是指连接到服务器
   */
  createRoom = () => {
    const { global } = this.props;
    global.createRoom();
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
        message: '请输入房间号码',
      });
      return;
    }
    client.emit('joinRoom', { roomId }, (err) => {
      if (err) {
        console.log(err);
        return;
      }
      // 跳转到房间
      Taro.redirectTo({
        url: room,
      });
    });
  }

  render() {
    const { global: { username } } = this.props;
    return (
      <View className="hall-page">
        <Text>欢迎: {username}</Text>
        <AtInput placeholder="请输入房间号" onChange={this.handleRoomIdChange} />
        <Button type="primary" onClick={this.joinRoom}>进入房间</Button>
        <Button className="btn--create-room" onClick={this.createRoom}>创建房间</Button>
        <AtMessage />
      </View>
    );
  }
}


import Taro, { Component } from '@tarojs/taro';
import {
  View,
  Text,
  Button,
} from '@tarojs/components';
import {
  AtInput,
} from 'taro-ui';
import { observer, inject } from '@tarojs/mobx';

import { socketUrl } from '../../constants';
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
    // 连接 socket.io
    this.client = io(socketUrl);
    this.client.on('global', this.handleGlobalEvent);
    this.client.on('joinRoom', this.handleNewUserJoinToRoom);
    this.client.on('estimate', this.getEstimate);
    this.client.on('disconnect', () => {
      console.log('和服务器断开连接，请点击重连');
    });
  }

  handleClickNumber = ({ value }) => {
    const { number } = this.state;
    // 给出估时
    this.socket.emit('give_estimate', {
      value,
    });
    this.setState({
      number: value,
    });
  }

  ensureEstimate = () => {
    const { number } = this.state;
    this.socket.emit('estimate', {
      estimate: number,
    });
  }

  /**
   * 加入房间，就是指连接到服务器
   */
  createRoom = () => {
    this.client.emit('createRoom', {}, ({ client, id }) => {
      global.createRoom(client);
      Taro.navigateTo({
        url: `/pages/room/index?id=${id}`,
      });
    });
  }

  render() {
    const { global: { username } } = this.props;
    return (
      <View className="hall-page">
        <Text>欢迎: {username}</Text>
        <Button onClick={this.createRoom}>创建房间</Button>
        <AtInput placeholder="请输入房间号" />
        <Button type="primary" onClick={this.ensureEstimate}>进入房间</Button>
      </View>
    );
  }
}


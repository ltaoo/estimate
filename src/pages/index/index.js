import Taro, { Component } from '@tarojs/taro'
import {
  View,
  Text,
  Button,
} from '@tarojs/components'
import {
  AtGrid,
  AtInput,
  AtMessage,
} from 'taro-ui'

import './index.less'

export default class Index extends Component {
  config = {
    navigationBarTitleText: '首页'
  }
  constructor(props) {
    super(props);

    console.log(this.$router.params);
    this.state = {
      username: '',
      users: [],
      chats: [],
    };
  }

  connect = () => {
    // 连接 socket.io
    this.socket = io('http://192.168.1.3:3000');
    this.socket.on('connect', () => {
      console.log('connect');
    });
    this.socket.on('global', this.handleGlobalEvent);
    this.socket.on('join', this.handleNewUserJoinToRoom);
    this.socket.on('estimate', this.getEstimate);
    this.socket.on('disconnect', () => {
      console.log('和服务器断开连接，请点击重连');
    });
  }

  handleGlobalEvent = (data) => {
    const { users } = data;
    this.setState({
      users,
    });
  }

  handleNewUserJoinToRoom = (data) => {
    console.log('join event', data);
    Taro.atMessage({
      'type': 'success',
      'message': `${data.username} 加入聊天`,
    });
    this.setState({
      users: data.users,
    });
  }

  handleUsernameChange = (value) => {
    this.setState({
      username: value,
    });
  }

  joinRoom = () => {
    const { username } = this.state;
    // this.socket.emit('join', {
    //   type: 'join',
    //   message: {
    //     username,
    //   },
    // });
    // localStorage.setItem('username', username);
    Taro.navigateTo({
      url: `/pages/room/index?username=${username}`,
    });
  }

  // 开始估时，就是不能再加用户了
  start = () => {
    this.socket.emit('start');
    this.setState({
      show: true,
    });
  }

  handleEstimateChange = (value) => {
    this.setState({
      estimate: value,
    });
  }

  handleEnsureEstimate = () => {
    const { estimate } = this.state;
    this.socket.emit('estimate', {
      estimate,
    });
  }

  /**
   * 获取到服务器端的估时推送
   */
  getEstimate = (data) => {
    const { estimates } = this.state;
    this.setState({
      estimates: estimates.concat(data),
    });
  }

  render () {
    const {
      username,
      users,
      show,
      estimate,
    } = this.state;

    const allUser = users.map((user) => {
      return <View key={user.id}><Text key={user.id}>{user.username}</Text></View>
    });
    if (show) {
      return (
        <View className='index'>
          <AtInput value={estimate} onChange={this.handleEstimateChange} />
          <Button onClick={this.handleEnsureEstimate}>确认</Button>
        </View>
      );
    }
    return (
      <View className='index'>
        <AtMessage />
        <AtInput
          placeholder="请输入用户名"
          value={username}
          onChange={this.handleUsernameChange}
        />
        <Button type="primary" onClick={this.joinRoom}>确认</Button>
        <AtGrid onClick={this.handleClickNumber} data={users.map(user => ({
          ...user,
          value: user.username,
        }))} />
      </View>
    )
  }
}

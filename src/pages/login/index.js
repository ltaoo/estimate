import Taro, { Component } from '@tarojs/taro';
import {
  View,
  Text,
} from '@tarojs/components';
import {
  AtInput,
  AtButton,
} from 'taro-ui';

export default class Login extends Component {
  render() {
    return (
      <View className='index'>
        <AtMessage />
        <AtInput
          placeholder="请输入用户名"
          value={username}
          onChange={this.handleUsernameChange}
        />
        <AtButton type="primary" onClick={this.joinRoom}>确认</AtButton>
      </View>
    );
  }
}

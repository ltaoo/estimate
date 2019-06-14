import Taro, { Component } from '@tarojs/taro';
import {
  View,
  Text,
  Input,
} from '@tarojs/components';
import {
  AtInput,
  AtButton,
} from 'taro-ui';

import './index.less';

export default class Login extends Component {
  state = {
    username: '',
  }

  handleUsernameChange = (value) => {
    this.setState({
      username: value,
    });
  }

  login = () => {
    const { username } = this.state;
    Taro.navigateTo({
      url: `/?username=${username}`,
    });
  }

  render() {
    const { username } = this.state;
    return (
      <View className='login-page'>
        <View className="login">
          <AtInput
            className="login__input--username"
            placeholder="请输入用户名"
            type="text"
            value={username}
            onChange={this.handleUsernameChange}
          />
          <AtButton className="login__btn" type="primary" onClick={this.login}>确认</AtButton>
        </View>
      </View>
    );
  }
}

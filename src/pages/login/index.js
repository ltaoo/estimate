import Taro from '@tarojs/taro';
import {
  View,
} from '@tarojs/components';
import {
  AtInput,
  AtButton,
  AtMessage,
} from 'taro-ui';
import { observer, inject } from '@tarojs/mobx';

import { hallPath } from '../../constants';
import './index.less';

@inject('global')
@observer
export default class Login extends Taro.Component {
  config = {
    navigationBarTitleText: '登录',
  }

  handleUsernameChange = (value) => {
    const { global } = this.props;
    global.saveUsername(value);
  }

  login = () => {
    const { global } = this.props;
    const { username } = global;
    if (username === '') {
      Taro.atMessage({
        type: 'error',
        message: '请输入用户名称',
      });
      return;
    }
    global.login();
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
          <AtMessage />
        </View>
      </View>
    );
  }
}

import Taro, { Component } from '@tarojs/taro'
import {
  View,
} from '@tarojs/components'
import {
  AtAvatar,
  AtButton,
  AtIcon,
} from 'taro-ui'
import { observer, inject } from '@tarojs/mobx';

import Spin from '../../components/Spin';
import { hallPath } from '../../constants';
import { checkLogin, redirectLogin } from '../../utils';

import './index.less'

@inject('global')
@observer
export default class Index extends Component {
  config = {
    navigationBarTitleText: '首页'
  }

  componentDidMount() {
    const { global } = this.props;
    setTimeout(() => {
      // 不存在 Layout 的概念，这部分逻辑就每个组件都需要了
      const user = Taro.getStorageSync('user');
      if (!user) {
        redirectLogin();
        return;
      }
      global.init({ user });
      Taro.redirectTo({
        url: hallPath,
      });
    }, 500);
  }

  render () {
    return (
      <View className='home-page'><Spin spining text="loading" /></View>
    )
  }
}

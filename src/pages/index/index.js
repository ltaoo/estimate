import Taro, { Component } from '@tarojs/taro'
import {
  View,
} from '@tarojs/components'
import {
  AtAvatar,
  AtButton,
} from 'taro-ui'

import NumberBoard from './components/NumberBoard';

import './index.less'

export default class Index extends Component {
  config = {
    navigationBarTitleText: '首页'
  }
  constructor(props) {
    super(props);

    const { username } = this.$router.params;
    if (username === undefined) {
      Taro.navigateTo({
        url: `/pages/login/index`,
      });
    }
  }

  selectNumber = (value) => {
    setTimeout(() => {
      Taro.navigateTo({
        url: `/pages/number/index?value=${value}`,
      });
    }, 200);
  }

  render () {
    return (
      <View className='home-page'>
        <NumberBoard onClick={this.selectNumber} />
      </View>
    )
  }
}

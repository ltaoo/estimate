import Taro, { Component } from '@tarojs/taro'
import {
  View,
} from '@tarojs/components'

import Spin from '../../components/Spin';

import './index.less'

export default class Index extends Component {
  config = {
    navigationBarTitleText: '首页'
  }

  render () {
    return (
      <View className='home-page'><Spin spining text='loading' /></View>
    )
  }
}

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
import { checkLogin, redirectLogin } from '../../utils';

import './index.less'

@inject('global')
@observer
export default class Index extends Component {
  config = {
    navigationBarTitleText: '首页'
  }

  componentDidMount() {
    // const { global } = this.props;
    // if (!checkLogin(global)) {
    //   redirectLogin();
    //   return;
    // }
  }

  render () {
    return (
      <View className='home-page'><Spin spining text="loading" /></View>
    )
  }
}

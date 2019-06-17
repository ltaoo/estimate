import Taro, { Component } from '@tarojs/taro'
import {
  View,
} from '@tarojs/components'
import {
  AtAvatar,
  AtButton,
} from 'taro-ui'
import { observer, inject } from '@tarojs/mobx';

import HeadCard from '../../components/HeadCard';
import NumberBoard from '../../components/NumberBoard';
import { checkLogin, redirectLogin } from '../../utils';

import './index.less'

@inject('global')
@observer
export default class Input extends Component {
  config = {
    navigationBarTitleText: '选择点数'
  }

  componentDidMount() {
    const { global } = this.props;
    if (!checkLogin(global)) {
      redirectLogin();
      return;
    }
  }

  selectNumber = (value) => {
    const { global } = this.props;
    global.updateEstimate(value);
  }

  render () {
    return (
      <View className='input-page'>
        <HeadCard title="选择点数" desc="选择需要的点数" />
        <View className="input-page__content">
          <NumberBoard onClick={this.selectNumber} />
        </View>
      </View>
    )
  }
}

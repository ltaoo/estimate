import Taro from '@tarojs/taro';
import {
  View,
  Text,
} from '@tarojs/components';
import { observer, inject } from '@tarojs/mobx';
import {
  AtButton,
  AtMessage,
} from 'taro-ui';

import './index.less';

@inject('global')
@observer
export default class OfflineError extends Taro.Component {
  shouldComponentUpdate() {
    return true;
  }

  reconnect = () => {
    const { global } = this.props;
    global.reconnect();
  }

  switchOfflineMode = () => {
    const { global } = this.props;
    global.switchOfflineMode();
  }

  render() {
    const { global: { loading } } = this.props;
    console.log('loading', loading);
    return (
      <View className='offline'>
        <View className='offline__icon'>
          <Text className='iconfont icon-offline icon__offline'></Text>
          <Text className='offline__text'>离线</Text>
        </View>
        <View className='offline__btns'>
          <AtButton
            className='offline__reconnect-btn'
            type='primary'
            loading={loading}
            onClick={this.reconnect}
          >点击重连</AtButton>
          <Text className='offline__offline-btn' onClick={this.switchOfflineMode}>进入离线模式</Text>
        </View>
        <AtMessage />
      </View>
    );
  }
}

import Taro from '@tarojs/taro';
import {
  View,
  Text,
} from '@tarojs/components';

import './index.less';

export default class OfflineCard extends Taro.Component {
  render() {
    return (
      <View>
        <Text className='offline-content'>
          <Text className='iconfont icon-offline offline-content__icon'></Text>
          <Text className='offline-content__text'>offline</Text>
        </Text>
      </View>
    );
  }
}

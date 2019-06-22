import Taro from '@tarojs/taro';
import {
  View,
} from '@tarojs/components';

import './index.less';

export default class Skeleton extends Taro.Component {
  render() {
    return (
      <View className='skeleton'>
        <View className='skeleton__content'>
          <View className='skeleton__paragraph'></View>
          <View className='skeleton__paragraph skeleton__paragraph--short'></View>
          <View className='skeleton__paragraph'></View>
          <View className='skeleton__paragraph skeleton__paragraph--long'></View>
          <View className='skeleton__paragraph'></View>
        </View>
      </View>
    );
  }
}

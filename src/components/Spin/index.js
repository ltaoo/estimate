import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import {
  AtIcon,
} from 'taro-ui';

import './index.less';

export default class Spin extends Taro.Component {
  render() {
    const { spining, text } = this.props;
    if (spining) {
      return (
        <View className='spin__wrapper'>
          <AtIcon className='spin' value='loading' />
          <View>
            <Text className='spin__text'>{text}</Text>
          </View>
        </View>
      );
    }
    return null;
  }
}

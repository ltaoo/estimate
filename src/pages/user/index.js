import Taro from '@tarojs/taro';
import {
  View,
  Text,
} from '@tarojs/components';

export default class User extends Taro.Component {
  render() {
    return (
      <View>
        <Text>用户中心</Text>
      </View>
    );
  }
}

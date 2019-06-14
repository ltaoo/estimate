import Taro, { Component } from '@tarojs/taro';
import {
  View,
} from '@tarojs/components';

import './index.less';

export default class Number extends Component {
  render() {
    const { value } = this.$router.params;
    const className = `iconfont icon-weitaoshuzi${value} number-card__text`;
    return (
      <View className="number-card">
        <span className={className} />
      </View>
    );
  }
}

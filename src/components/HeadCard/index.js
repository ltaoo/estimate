import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import PropTypes from 'prop-types';

import './index.less';

export default class HeadCard extends Taro.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
  }
  render() {
    const { title } = this.props;
    return (
      <View className="head-card">
        <h1 className="head-card__title">{title}</h1>
        <small className="head-card__desc">加入已存在的房间或者创建房间</small>
      </View>
    );
  }
}

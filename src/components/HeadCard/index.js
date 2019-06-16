import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import PropTypes from 'prop-types';

import './index.less';

export default class HeadCard extends Taro.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    desc: PropTypes.string.isRequired,
  }

  render() {
    const { title, desc } = this.props;
    return (
      <View className="head-card">
        <h1 className="head-card__title">{title}</h1>
        <small className="head-card__desc">{desc}</small>
      </View>
    );
  }
}

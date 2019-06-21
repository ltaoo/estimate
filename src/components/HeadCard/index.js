import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import PropTypes from 'prop-types';

import './index.less';

export default class HeadCard extends Taro.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    desc: PropTypes.string.isRequired,
  }

  static defaultProps = {
    extra: null,
  }

  render() {
    const { title, desc, extra } = this.props;
    return (
      <View className='head-card'>
        <View className='head-card__info'>
          <Text className='head-card__title'>{title}</Text>
          <Text className='head-card__desc'>{desc}</Text>
      </View>
      <View className='head-card__extra'>{extra}</View>
      </View>
    );
  }
}

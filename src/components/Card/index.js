import Taro from '@tarojs/taro';
import {
  View,
  Text,
} from '@tarojs/components';
import PropTypes from 'prop-types';

import './index.less';

export default class Card extends Taro.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
  }

  render() {
    const { title, children } = this.props;
    return (
      <View className='card'>
        <View className='card__header'>
          {title && <Text className='card__title'>{title}</Text>}
        </View>
        <View className='card__content'>{children}</View>
      </View>
    );
  }
}

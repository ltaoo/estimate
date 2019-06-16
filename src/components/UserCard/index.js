import Taro from '@tarojs/taro';
import {
  View,
  Text,
} from '@tarojs/components';
import PropTypes from 'prop-types';
import {
  AtAvatar,
} from 'taro-ui';

import './index.less';

export default class UserCard extends Taro.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    // avatar: PropTypes.string.isRequired,
  }

  render() {
    const { name, isAdmintor, extra } = this.props;
    const nameClassName = isAdmintor ? 'user-card__name--admintor' : '';
    return (
      <View className="user-card">
        <View className="user-card__content">
          <View className="user-card__avatar">
            <AtAvatar circle text={name}></AtAvatar>
          </View>
          <Text className={`user-card__name ${nameClassName}`}>{name}</Text>
        </View>
      </View>
    );
  }
}

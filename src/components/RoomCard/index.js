import Taro from '@tarojs/taro';
import {
  View,
  Text,
} from '@tarojs/components';
import PropTypes from 'prop-types';
import {
  AtIcon,
  AtAvatar,
} from 'taro-ui';

import './index.less';

const ROOM_STATUS = {
  ENABLE: 'ENABLE',
  CREATED: 'CREATED',
};

export default class RoomCard extends Taro.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
  }

  handleClick = () => {
    const { title, status, onClick } = this.props;
    onClick({ title, status });
  }

  render() {
    const { title, status, onClick } = this.props;
    return (
      <View className="room-card" onClick={this.handleClick}>
        <View className="room-card__content">
          <Text className="room-card__title">{title}</Text>
        </View>
        <View>
          <View>
            <AtIcon value="chevron-right" />
          </View>
        </View>
      </View>
    );
  }
}

import Taro from '@tarojs/taro';
import {
  View,
  Text,
} from '@tarojs/components';
import PropTypes from 'prop-types';
import {
  AtIcon,
} from 'taro-ui';

import './index.less';

export const ROOM_STATUS = {
  ENABLE: 'ENABLE',
  STARTED: 'STARTED',
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
    const { title, status } = this.props;
    console.log(status);
    return (
      <View className='room-card' onClick={this.handleClick}>
        <View className='room-card__content'>
          <Text className='room-card__title'>{title}</Text>
        </View>
        <View>
          <View>
            {status === ROOM_STATUS.ENABLE
              ? <AtIcon value='chevron-right' />
              : <Text className='room-card__tip'>已开始估时</Text>
            }
          </View>
        </View>
      </View>
    );
  }
}

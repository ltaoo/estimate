import Taro, { Component } from '@tarojs/taro';
import {
  View,
  Text,
  Button,
} from '@tarojs/components';
import {
  AtInput,
} from 'taro-ui';

import withLogin from '../../utils/withLogin';

@withLogin()
export default class Room extends Component {
  constructor(props) {
    super(props);

    const { username } = this.$router.params;
    this.state = {
      username,
    };
  }

  /**
   * 开始估时
   */
  startEstimate = () => {
    const { id } = this.$router.params;
    this.client.emit('startEstimate', { id });
  }

  render() {
    const { number, username } = this.state;
    return (
      <View className="room-page">
        <Button onClick={this.startEstimate}>开始</Button>
      </View>
    );
  }
}

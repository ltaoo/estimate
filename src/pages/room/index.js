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
  }
  componentDidMount() {
    // 监听
  }
  /**
   * 开始估时
   */
  startEstimate = () => {
    const { id } = this.$router.params;
    this.client.emit('startEstimate', { id });
  }

  render() {
    const { global: { roomId, users } } = this.props;
    console.log(users);
    return (
      <View className="room-page">
        <Text>房间ID: {roomId}</Text>
        <View>
          <View>
            <Text>成员</Text>
          </View>
          {users.map(user => (
            <View>
              <Text>{user.admin ? '组长 - ' : ''}{user.username}</Text>
            </View>
          ))}
        </View>
        <Button onClick={this.startEstimate}>开始</Button>
      </View>
    );
  }
}

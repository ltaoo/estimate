import Taro, { Component } from '@tarojs/taro';
import {
  View,
  Text,
  Button,
} from '@tarojs/components';
import {
  AtInput,
} from 'taro-ui';
import { observer, inject } from '@tarojs/mobx';

import { checkLogin, redirectLogin } from '../../utils';
import withLogin from '../../utils/withLogin';

@inject('global')
@observer
export default class Room extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    const { global } = this.props;
    const { username } = global;

    if (!checkLogin(global)) {
      redirectLogin();
      return;
    }
  }
  /**
   * 开始估时
   */
  startEstimate = () => {
    const { global } = this.props;
    const { client, roomId } = global;
    global.startEstimate();
    client.emit('startEstimate', { roomId });
  }

  render() {
    const { global } = this.props;
    const { roomId, users } = global;
    const isAdmintor = global.isAdmintor();

    return (
      <View className="room-page">
        <Text>房间ID: {roomId}</Text>
        <View>
          <View>
            <Text>成员</Text>
          </View>
          {users.map(user => (
            <View>
              <Text>{user.isAdmintor ? '组长 - ' : ''}{user.name}</Text>
            </View>
          ))}
        </View>
        {isAdmintor && <Button onClick={this.startEstimate}>开始</Button>}
      </View>
    );
  }
}

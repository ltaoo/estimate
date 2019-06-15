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
    const { id } = this.$router.params;
    this.client.emit('startEstimate', { id });
  }

  render() {
    const { global: { username, roomId, users } } = this.props;
    const owner = users.find(user => user.admin);
    let isAdmin = false;
    if (owner && owner.username === username) {
      isAdmin = true;
    }
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
        {isAdmin && <Button onClick={this.startEstimate}>开始</Button>}
      </View>
    );
  }
}

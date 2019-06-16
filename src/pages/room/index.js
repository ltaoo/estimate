import Taro, { Component } from '@tarojs/taro';
import {
  View,
  Text,
} from '@tarojs/components';
import {
  AtMessage,
  AtInput,
  AtButton,
} from 'taro-ui';
import { observer, inject } from '@tarojs/mobx';

import HeadCard from '../../components/HeadCard';
import UserCard from '../../components/UserCard';
import { checkLogin, redirectLogin } from '../../utils';

import './index.less';

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

    const title = `房间编号 ${roomId}`;

    return (
      <View className="room-page">
        <HeadCard title={title} desc="等待全部成员加入后开始估时" />
        <View className="room-page__content">
          <View>
            {users.map(user => (
              <UserCard isAdmintor={user.isAdmintor} name={user.name} />
            ))}
          </View>
          {isAdmintor && <AtButton type="primary" onClick={this.startEstimate}>开始</AtButton>}
        </View>
        <AtMessage />
      </View>
    );
  }
}

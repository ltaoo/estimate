import Taro, { Component } from '@tarojs/taro';
import {
  View,
  Text,
} from '@tarojs/components';
import {
  AtMessage,
  AtInput,
  AtButton,
  AtFab,
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

  componentWillUnmount() {
    console.log('unmount');
    const { global } = this.props;
    global.leaveRoom();
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
        <HeadCard title={title} desc="等待全部成员加入后由组长开始估时" />
        <View className="room-page__content">
          <View>
            {users.map(user => (
              <UserCard isAdmintor={user.isAdmintor} name={user.name} />
            ))}
          </View>
          {isAdmintor && (
            <View className="btn--start-estimate">
              <AtFab circle type="primary" onClick={this.startEstimate}>
                <Text className='at-fab__icon at-icon at-icon-lightning-bolt'></Text>
              </AtFab>
            </View>
          )}
        </View>
        <AtMessage />
      </View>
    );
  }
}

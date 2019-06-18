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
import Card from '../../components/Card';
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
    global.init();
    if (!checkLogin(global)) {
      redirectLogin();
      return;
    }
  }

  componentWillUnmount() {
    const { global } = this.props;
    global.leaveRoom();
  }

  /**
   * 开始估时
   */
  startEstimate = () => {
    const { global } = this.props;
    const { client, roomId, users } = global;
    if (users.length === 1) {
      Taro.atMessage({
        type: 'error',
        message: '房间内只有一个成员',
      });
      return;
    }
    global.startEstimate();
  }

  render() {
    const { global } = this.props;
    const { user, room } = global;
    console.log('room page render', user.createdRoomId, room.id);
    const { joinedRoomId } = user;
    const isAdmintor = global.isAdmintor();

    const title = `房间编号 ${room.id}`;
    const memberNumberTitle = `当前共 ${room.members.length} 人`;

    return (
      <View className="room-page">
        <HeadCard title={title} desc="等待全部成员加入后由组长开始估时" />
        <View className="room-page__content">
          <Card title={memberNumberTitle}>
            <View>
              {room.members.map(user => (
                <UserCard isAdmintor={user.createdRoomId === room.id} name={user.name} />
              ))}
            </View>
          </Card>
          {isAdmintor && (
            <View className="btn--start-estimate">
              <AtFab circle type="primary" onClick={this.startEstimate}>
                <Text className="at-fab__icon at-icon at-icon-lightning-bolt"></Text>
              </AtFab>
            </View>
          )}
        </View>
        <AtMessage />
      </View>
    );
  }
}

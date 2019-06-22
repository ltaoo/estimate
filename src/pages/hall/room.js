import Taro, { Component } from '@tarojs/taro';
import {
  View,
  Text,
  Button,
} from '@tarojs/components';
import {
  AtFab,
  AtModal,
  AtModalHeader,
  AtModalContent,
  AtModalAction,
} from 'taro-ui';
import { observer, inject } from '@tarojs/mobx';

import Card from '../../components/Card';
import UserCard from '../../components/UserCard';
import withBasicLayout from '../../utils/withBasicLayout';

import './index.less';

@withBasicLayout()
@inject('global')
@observer
export default class Room extends Component {
  constructor(props) {
    super(props);

    const { global } = props;
    console.log(global.room);
    global.checkHasRoom();
  }

  showLeaveRoomTipModal = () => {
    this.setState({
      leaveRoomTipModalVisible: true,
    });
  }

  hideLeaveRoomTipModal = () => {
    this.setState({
      leaveRoomTipModalVisible: false,
    });
  }

  handleLeaveRoom = () => {
    console.log('leave room');
    this.showLeaveRoomTipModal();
  }

  leaveRoom = () => {
    const { global } = this.props;
    global.leaveRoom();
  }

  /**
   * 开始估时
   */
  startEstimate = () => {
    const { global } = this.props;
    const { users } = global;
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
    const { leaveRoomTipModalVisible } = this.state;
    const { global } = this.props;
    const { user, room } = global;
    console.log('room page render', room, room === null, room === undefined, user.createdRoomId, room.id);
    const isAdmintor = global.isAdmintor();

    const memberNumberTitle = `当前共 ${room.members.length} 人`;

    return (
      <View className='room-page'>
        <View className='room-page__content'>
          <Card title={memberNumberTitle}>
            <View>
              {room.members.map(member => (
                <UserCard key={member.id} isAdmintor={member.createdRoomId === room.id} name={user.name} />
              ))}
            </View>
          </Card>
          {isAdmintor && (
            <View className='btn--start-estimate'>
              <AtFab circle type='primary' onClick={this.startEstimate}>
                <Text className='at-fab__icon at-icon at-icon-lightning-bolt'></Text>
              </AtFab>
            </View>
          )}
        </View>
        <AtModal
          isOpened={leaveRoomTipModalVisible}
        >
          <AtModalHeader>确认要离开房间吗？</AtModalHeader>
          <AtModalContent>离开房间后会返回大厅，可重新进入其他房间</AtModalContent>
          <AtModalAction>
            <Button onClick={this.hideLeaveRoomTipModal}>取消</Button>
            <Button type='primary' onClick={this.leaveRoom}>确认</Button>
          </AtModalAction>
        </AtModal>
      </View>
    );
  }
}

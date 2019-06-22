import Taro, { Component } from '@tarojs/taro';
import {
  View,
  Button,
} from '@tarojs/components';
import {
  AtButton,
  AtModal,
  AtModalHeader,
  AtModalContent,
  AtModalAction,
} from 'taro-ui';
import { observer, inject } from '@tarojs/mobx';

import Card from '../../components/Card';
import UserCard from '../../components/UserCard';
import { ROOM_STATUS } from '../../components/RoomCard';
import { inputPath } from '../../constants/paths';
import withBasicLayout from '../../utils/withBasicLayout';
import { checkIsAdmintor } from '../../utils';

import './index.less';

@withBasicLayout()
@inject('global')
@inject('hall')
@observer
export default class Room extends Component {
  componentDidHide() {
    console.log('room page hide');
    const { hall } = this.props;
    hall.leaveRoom();
  }

  componentWillUnmount() {
    console.log('room page un mount');
    const { hall } = this.props;
    hall.leaveRoom();
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
    const { hall } = this.props;
    const { room } = hall;
    if (room.members.length === 1) {
      Taro.atMessage({
        type: 'error',
        message: '房间内只有一个成员',
      });
      return;
    }
    hall.startEstimate();
  }

  backToInputEstimate = () => {
    Taro.navigateTo({
      url: inputPath,
    });
  }

  render() {
    const { leaveRoomTipModalVisible } = this.state;
    const { global, hall } = this.props;
    const { user } = global;
    const { room } = hall;
    const isAdmintor = checkIsAdmintor({ user, room });
    const memberNumberTitle = `当前共 ${room.members.length} 人`;

    return (
      <View className='room-page'>
        <View className='room-page__content'>
          {isAdmintor && (
            <AtButton type='primary' onClick={this.startEstimate}>
              开始估时
            </AtButton>
          )}
          {room.status === ROOM_STATUS.STARTED && (
            <AtButton onClick={this.backToInputEstimate}>进入估时</AtButton>
          )}
          <Card title={memberNumberTitle}>
            <View>
              {room.members.map(member => {
                return (
                  <UserCard
                    key={member.id}
                    isAdmintor={member.createdRoomId === room.id}
                    name={member.name}
                  />
                );
              })}
            </View>
          </Card>

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

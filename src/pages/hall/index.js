import Taro, { Component } from '@tarojs/taro';
import {
  View,
} from '@tarojs/components';
import {
  AtInput,
  AtButton,
} from 'taro-ui';
import { observer, inject } from '@tarojs/mobx';

import Card from '../../components/Card';
import RoomCard, { ROOM_STATUS } from '../../components/RoomCard';
import withBasicLayout from '../../utils/withBasicLayout';

import './index.less';
import { roomPath } from '../../constants/paths';

@withBasicLayout()
@inject('hall')
@inject('global')
@observer
export default class HallPage extends Component {
  config = {
    navigationBarTitleText: '大厅'
  }

  handleClickRoom = ({ title, status }) => {
    if (status === ROOM_STATUS.STARTED) {
      return;
    }
    const { global } = this.props;
    global.joinRoom(title);
  }

  /**
   * 创建房间
   */
  createRoom = () => {
    const { hall } = this.props;
    hall.createRoom();
  }

  /**
   * 输入房间号
   */
  handleRoomIdChange = (value) => {
    const { hall } = this.props;
    hall.updateRoomId(value);
  }

  backToRoom = () => {
    const { global: { user } } = this.props;
    // 回到房间
    Taro.navigateTo({
      url: `${roomPath}?id=${user.joinedRoomId}`,
    });
  }

  /**
   * 加入指定房间
   * @param {string} value - 房间 id
   */
  joinRoom = () => {
    const { hall } = this.props;
    const { inputedRoomId } = hall;
    if (inputedRoomId === undefined) {
      Taro.atMessage({
        type: 'error',
        message: '请输入房间号码',
      });
      return;
    }
    hall.joinRoom(inputedRoomId);
  }

  handleClickTabBar = (value) => {
    const { global } = this.props;
    global.changeTabBarIndex(value);
  }

  render() {
    const {
      global: { user },
      hall: { rooms },
    } = this.props;
    return (
      <View className='hall-page'>
        <View className='page__content hall-page__content'>
          <Card title='已加入的房间'>
            <AtButton
              type='primary'
              onClick={this.backToRoom}
            >返回房间 {user.joinedRoomId}</AtButton>
          </Card>
          <View>
            <Card title='输入房间编号或创建房间'>
              <AtInput
                title='房间号'
                placeholder='请输入房间号'
                onChange={this.handleRoomIdChange}
              />
              <AtButton type='primary' onClick={this.joinRoom}>进入房间</AtButton>
              <AtButton
                className='btn--create-room'
                onClick={this.createRoom}
              >创建房间</AtButton>
            </Card>
            <Card title='已有房间'>
              {rooms.map(room => (
                <RoomCard
                  key={room.id}
                  title={room.id}
                  status={room.status}
                  onClick={this.handleClickRoom}
                />
              ))}
            </Card>
          </View>
        </View>
      </View>
    );
  }
}


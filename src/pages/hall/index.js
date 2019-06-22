import Taro, { Component } from '@tarojs/taro';
import {
  View,
  Text,
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
    const { global } = this.props;
    global.createRoom();
  }

  /**
   * 输入房间号
   */
  handleRoomIdChange = (value) => {
    const { global } = this.props;
    global.updateRoomId(value);
  }

  backToRoom = () => {
    // 回到房间
    const { hall } = this.props;
    hall.backToRoom();
  }

  /**
   * 加入指定房间
   * @param {string} value - 房间 id
   */
  joinRoom = () => {
    const { global } = this.props;
    const { roomId } = global;
    if (roomId === undefined) {
      Taro.atMessage({
        type: 'error',
        message: '请输入房间号码',
      });
      return;
    }
    global.joinRoom(roomId);
  }

  handleClickTabBar = (value) => {
    const { global } = this.props;
    global.changeTabBarIndex(value);
  }

  render() {
    const {
      hall: { rooms },
      global: { client, offlineMode, user },
    } = this.props;
    console.log(offlineMode, client, user);
    const content = client === null
      ? (
        <View className='hall-page__content--empty'>
          <Text className='offline-content'>
            <Text className='iconfont icon-offline offline-content__icon'></Text>
            <Text className='offline-content__text'>offline</Text>
          </Text>
        </View>
      )
      : (
        <View>
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
          <Card title='输入房间编号或创建房间'>
            <AtInput title='房间号' placeholder='请输入房间号' onChange={this.handleRoomIdChange} />
            <AtButton type='primary' onClick={this.joinRoom}>进入房间</AtButton>
            <AtButton className='btn--create-room' onClick={this.createRoom}>创建房间</AtButton>
          </Card>
        </View>
      );
    return (
      <View className='hall-page'>
        <View className='page__content hall-page__content'>
          {content}
        </View>
      </View>
    );
  }
}


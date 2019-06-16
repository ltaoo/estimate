import Taro, { Component } from '@tarojs/taro';
import {
  View,
  Text,
} from '@tarojs/components';
import {
  AtInput,
  AtMessage,
  AtButton,
  AtNavBar,
} from 'taro-ui';
import { observer, inject } from '@tarojs/mobx';

import Card from '../../components/Card';
import HeadCard from '../../components/HeadCard';
import RoomCard, { ROOM_STATUS } from '../../components/RoomCard';
import { socketUrl, roomPath } from '../../constants';
import { checkLogin, redirectLogin } from '../../utils';

import './index.less';

@inject('global')
@observer
export default class Hall extends Component {
  config = {
    navigationBarTitleText: '大厅'
  }
  /**
   * 进入该页面，就是连接的服务器端，可以向全局广播「某某加入大厅」
   */
  componentDidMount() {
    const { global } = this.props;
    const { client } = global;

    if (!checkLogin(global)) {
      redirectLogin();
      return;
    }
    // 从房间页面返回，会重新触发这里
    if (!client) {
      global.connect();
    }
  }

  handleClickRoom = ({ title, status }) => {
    if (status === ROOM_STATUS.STARTED) {
      return;
    }
    const { global } = this.props;
    global.joinRoom(title);
    // @TODO 如果加入房间出错，就不应该继续跳转
    Taro.navigateTo({
      url: roomPath,
    });
  }

  /**
   * 加入房间，就是指连接到服务器
   */
  createRoom = () => {
    const { global } = this.props;
    global.createRoom();
    Taro.navigateTo({
      url: roomPath,
    });
  }

  /**
   * 输入房间号
   */
  handleRoomIdChange = (value) => {
    const { global } = this.props;
    global.updateRoomId(value);
  }

  /**
   * 加入指定房间
   * @param {string} value - 房间 id
   */
  joinRoom = () => {
    const { global } = this.props;
    const { client, roomId } = global;
    if (roomId === undefined) {
      Taro.atMessage({
        type: 'error',
        message: '请输入房间号码',
      });
      return;
    }
    global.joinRoom(roomId);
    // @TODO 如果加入房间出错，就不应该继续跳转
    Taro.navigateTo({
      url: roomPath,
    });
  }

  render() {
    const { global: { rooms } } = this.props;
    return (
      <View className="hall-page">
        <HeadCard title="大厅" desc="加入已存在的房间或者创建房间" />
        <View className="hall-page__content">
          <Card title="已有房间">
            {rooms.map(room => (
              <RoomCard
                key={room.id}
                title={room.id}
                status={room.status}
                onClick={this.handleClickRoom}
              />
            ))}
          </Card>
          <Card title="加入或者创建房间">
            <AtInput title="房间号" placeholder="请输入房间号" onChange={this.handleRoomIdChange} />
            <AtButton type="primary" onClick={this.joinRoom}>进入房间</AtButton>
            <AtButton
              type="secondary" className="btn--create-room"
              onClick={this.createRoom}>创建房间
            </AtButton>
          </Card>
        </View>
        <AtMessage />
      </View>
    );
  }
}


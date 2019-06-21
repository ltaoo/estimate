import Taro, { Component } from '@tarojs/taro';
import {
  View,
  Text,
  Button,
} from '@tarojs/components';
import {
  AtMessage,
  AtInput,
  AtButton,
  AtFab,
  AtIcon,
  AtModal,
  AtModalHeader,
  AtModalContent,
  AtModalAction,
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
    
    const { global } = props;
    console.log(global.room);
    global.checkHasRoom();
  }
  componentDidMount() {
    const { global } = this.props;
    global.init();
    if (!checkLogin(global)) {
      redirectLogin();
      return;
    }
  }

  // 主要是这里很麻烦
  componentWillUnmount() {
    // const { global } = this.props;
    // global.leaveRoom();
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
    const { leaveRoomTipModalVisible } = this.state;
    const { global } = this.props;
    const { user, room } = global;
    console.log('room page render', room, room === null, room === undefined, user.createdRoomId, room.id);
    const { joinedRoomId } = user;
    const isAdmintor = global.isAdmintor();

    const title = `房间编号 ${room.id}`;
    const memberNumberTitle = `当前共 ${room.members.length} 人`;
    const leaveRoomBtn = (
      <View onClick={this.handleLeaveRoom}><AtIcon value="close" /></View>
    );

    return (
      <View className="room-page">
        <HeadCard 
	  title={title} 
          desc="等待全部成员加入后由组长开始估时" 
          extra={leaveRoomBtn}
	/>
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
	<AtModal
	  isOpened={leaveRoomTipModalVisible}
        >
          <AtModalHeader>确认要离开房间吗？</AtModalHeader>
          <AtModalContent>离开房间后会返回大厅，可重新进入其他房间</AtModalContent>
          <AtModalAction>
	    <Button onClick={this.hideLeaveRoomTipModal}>取消</Button>
	    <Button type="primary" onClick={this.leaveRoom}>确认</Button>
          </AtModalAction>
	</AtModal>
        <AtMessage />
      </View>
    );
  }
}

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

import HeadCard from '../../components/HeadCard';
import { socketUrl, room, home } from '../../constants';
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

    if (!checkLogin(global)) {
      redirectLogin();
      return;
    }
    global.connect();
  }

  /**
   * 加入房间，就是指连接到服务器
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
    global.joinRoom();
  }

  render() {
    const { global: { username } } = this.props;
    return (
      <View className="hall-page">
        <HeadCard title="大厅" desc="加入已存在的房间或者创建房间" />
        <View className="hall-page__content">
          <AtInput title="房间号" placeholder="请输入房间号" onChange={this.handleRoomIdChange} />
          <AtButton type="primary" onClick={this.joinRoom}>进入房间</AtButton>
          <AtButton
            type="secondary" className="btn--create-room"
            onClick={this.createRoom}>创建房间
          </AtButton>
        </View>
        <AtMessage />
      </View>
    );
  }
}


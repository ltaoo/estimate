/**
 * 点数卡片页
 */
import Taro, { Component } from '@tarojs/taro';
import {
  View,
  Text,
} from '@tarojs/components';
import {
  AtButton,
  AtMessage,
} from 'taro-ui';
import { observer, inject } from '@tarojs/mobx';

import Card from '../../components/Card';
import UserCard from '../../components/UserCard';
import { checkLogin, redirectLogin } from '../../utils';
import { resultPath } from '../../constants';

import './index.less';

@inject('global')
@observer
export default class Estimate extends Component {
  componentDidMount() {
    const { global } = this.props;
    const { username } = global;

    if (!checkLogin(global)) {
      redirectLogin();
      return;
    }

    global.init();
  }

  showResult = () => {
    const { global: { client, roomId } } = this.props;
    client.emit('showResult', { roomId });
  }

  render() {
    const { global } = this.props;
    const {
      user, room,
    } = global;
    const isAdmintor = global.isAdmintor();
    const className = `iconfont icon-weitaoshuzi${user.estimate} number-card__text`;
    const estimates = room.members;
    const estimatedMembers = estimates.filter(e => e.estimate !== null);
    const showEstimate = estimates.every(mem => mem.estimate !== null);
    const title = `共 ${estimatedMembers.length} 人给出了估时`;

    return (
      <View className="estimate-page">
        <View className="number-card"><span className={className} /></View>
        <View className="page__content">
          <Card title={title}>
            {estimates.filter(e => e.name !== user.name).map(item => (
              <UserCard name={item.name} estimate={item.estimate !== null} />
            ))}
          </Card>
          {(isAdmintor && showEstimate) && <AtButton onClick={this.showResult}>展示结果</AtButton>}
        </View>
        <AtMessage />
      </View>
    );
  }
}

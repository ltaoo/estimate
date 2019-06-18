import Taro, { Component } from '@tarojs/taro';
import {
  View,
  Text,
} from '@tarojs/components';
import {
  AtButton,
} from 'taro-ui';
import { observer, inject } from '@tarojs/mobx';

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
      username, estimate, estimates, showEstimate,
    } = global;
    const isAdmintor = global.isAdmintor();
    const className = `iconfont icon-weitaoshuzi${estimate} number-card__text`;

    return (
      <View className="estimate-page">
        <View className="number-card"><span className={className} /></View>
        {estimates.filter(e => e.name !== username).map(item => (
          <UserCard name={item.name} />
        ))}
        {(isAdmintor && showEstimate) && <AtButton onClick={this.showResult}>展示结果</AtButton>}
      </View>
    );
  }
}

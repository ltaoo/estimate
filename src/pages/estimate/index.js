import Taro, { Component } from '@tarojs/taro';
import {
  View,
  Text,
  Button,
} from '@tarojs/components';
import { observer, inject } from '@tarojs/mobx';

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
  }

  showResult = () => {
    const { global: { client, roomId } } = this.props;
    client.emit('showResult', { roomId });
  }

  render() {
    const { global: {
      username, users, roomId, estimate, estimates, showEstimate,
    } } = this.props;

    const owner = users.find(user => user.admin);
    let isAdmin = false;
    if (
      owner
      && owner.username === username
      && owner.roomId === roomId
    ) {
      isAdmin = true;
    }
    console.log(username, isAdmin, roomId, owner);
    const className = `iconfont icon-weitaoshuzi${estimate} number-card__text`;
    return (
      <View className="estimate-page">
        <Text>{username}</Text>
        <View className="number-card">
          <span className={className} />
        </View>
        {estimates.filter(e => e.username !== username).map(item => (
          <View>
            <Text>{item.username}</Text>
            <Text>给出了估时</Text>
          </View>
        ))}
        {(isAdmin && showEstimate) && <Button onClick={this.showResult}>展示</Button>}
      </View>
    );
  }
}

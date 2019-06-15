/**
 * @file 展示估时结果
 */
import Taro, { Component } from '@tarojs/taro';
import {
  View,
  Text,
  Button,
} from '@tarojs/components';
import { observer, inject } from '@tarojs/mobx';

import { checkLogin, redirectLogin } from '../../utils';
import { computeEstimates } from './utils';

@inject('global')
@observer
export default class Result extends Component {
  componentDidMount() {
    const { global } = this.props;
    const { username } = global;

    if (!checkLogin(global)) {
      redirectLogin();
      return;
    }
  }

  restartEstimate = () => {
    const { global: { client, roomId } } = this.props;
    client.emit('restartEstimate', { roomId });
  }


  render() {
    const { global: { users, username, roomId, estimates } } = this.props;
    const stat = computeEstimates(estimates);
    console.log(stat, estimates);
    const elm = estimates
      .sort((a, b) => {
        return a.value - b.value;
      })
      .map(item => (
        <View>
          <Text>{item.username}</Text>
          <Text>{item.value}</Text>
        </View>
      ));
    const owner = users.find(user => user.admin);
    let isAdmin = false;
    if (
      owner
      && owner.username === username
      && owner.roomId === roomId
    ) {
      isAdmin = true;
    }
    return (
      <View>
        <Text>估时结果</Text>
        {stat.map(s => (
          <View>
            <Text>{s.value}</Text>有<Text>{s.number}</Text>
          </View>
        ))}
        {elm}
        {isAdmin && <Button onClick={this.restartEstimate}>重新开始估时</Button>}
      </View>
    );
  }
}

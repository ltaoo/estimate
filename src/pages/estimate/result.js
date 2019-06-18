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

import HeadCard from '../../components/HeadCard';
import Card from '../../components/Card';
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
    global.init();
  }

  restartEstimate = () => {
    const { global } = this.props;
    global.restartEstimate();
  }

  render() {
    const { global } = this.props;
    const { user, room } = global;
    const estimates = room.members;
    const isAdmintor = global.isAdmintor();
    const stat = computeEstimates(estimates);
    console.log(stat, estimates);
    const elm = estimates
      .sort((a, b) => {
        return a.estimate - b.estimate;
      })
      .map(item => (
        <View>
          <Text>{item.name}</Text>
          <Text>{item.estimate}</Text>
        </View>
      ));
    return (
      <View>
        <HeadCard title="估时结果" desc="统计估时结果" />
        <View className="page__content">
          {stat.map(s => (
            <View>
              <Text>{s.value}</Text>有<Text>{s.number}</Text>
            </View>
          ))}
          {elm}
          {isAdmintor && <Button onClick={this.restartEstimate}>重新开始估时</Button>}
        </View>
      </View>
    );
  }
}

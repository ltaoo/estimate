/**
 * @file 展示估时结果
 */
import Taro, { Component } from '@tarojs/taro';
import {
  View,
  Text,
} from '@tarojs/components';
import {
  AtMessage,
  AtButton,
} from 'taro-ui';
import { observer, inject } from '@tarojs/mobx';

import HeadCard from '../../components/HeadCard';
import Card from '../../components/Card';
import { checkLogin, redirectLogin } from '../../utils';
import { computeEstimates } from './utils';

import './index.less';

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
    const estimateDetails = estimates
      .sort((a, b) => {
        return b.estimate - a.estimate;
      })
      .map(item => (
        <View className="result__detail">
          <Text className="result__name">{item.name}</Text>
          <Text className="result__value">{item.estimate}</Text>
        </View>
      ));
    return (
      <View>
        <HeadCard title="估时结果" desc="统计估时结果" />
        <View className="page__content">
          <Card title="统计">
            {stat.map(s => (
              <View className="stats">
                <span className={`iconfont icon-weitaoshuzi${s.value} stats__value`}></span>
                <Text className="stats__num">{s.number}</Text>
              </View>
            ))}
          </Card>
          <Card title="详情">
            {estimateDetails}
          </Card>
          {isAdmintor && <AtButton type="primary" onClick={this.restartEstimate}>重新开始估时</AtButton>}
        </View>
        <AtMessage />
      </View>
    );
  }
}

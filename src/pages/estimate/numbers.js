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
} from 'taro-ui';
import { observer, inject } from '@tarojs/mobx';

import Card from '../../components/Card';
import UserCard from '../../components/UserCard';
import { checkIsAdmintor } from '../../utils';
import withBasicLayout from '../../utils/withBasicLayout';

import './index.less';

@withBasicLayout({ showHeadCard: false })
@inject('global')
@inject('hall')
@inject('estimate')
@observer
export default class Estimate extends Component {
  reselectEstimate = () => {
    const { estimate } = this.props;
    estimate.clearEstimate();
  }

  showResult = () => {
    const { estimate } = this.props;
    estimate.showEstimateResult();
  }

  render() {
    const { global, hall, estimate: estimateStore } = this.props;
    const { user } = global;
    const { room } = hall;
    const {
      estimatedMembers,
      unestimatedMembers,
      showEstimate,
    } = estimateStore;

    const isAdmintor = checkIsAdmintor({ user, room });
    const className = `iconfont icon-weitaoshuzi${user.estimate} number-card__text`;
    console.log(JSON.stringify(room.members, null, '\t'));
    const estimatedTitle = `${estimatedMembers.length}人给出了估时`;
    const unestimatedTitle = `${unestimatedMembers.length}人未给出估时`;

    return (
      <View className='estimate-page'>
        <View className='number-card'><Text className={className} /></View>
        <View className='page__content'>
          <AtButton type='primary' onClick={this.reselectEstimate}>重选点数</AtButton>
          {(isAdmintor && showEstimate) && <AtButton className='btn--show-result' onClick={this.showResult}>展示结果</AtButton>}
          <Card title={estimatedTitle}>
            {estimatedMembers
              .map(item => (
                <UserCard
                  key={item.id} name={item.name} estimate={item.estimate !== null}
                />
              ))}
          </Card>
          <Card title={unestimatedTitle}>
            {unestimatedMembers
              .map(item => (
                <UserCard
                  key={item.id} name={item.name} estimate={item.estimate === null}
                />
              ))}
          </Card>
        </View>
      </View>
    );
  }
}

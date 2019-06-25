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
  AtActionSheet,
  AtActionSheetItem,
} from 'taro-ui';
import { observer, inject } from '@tarojs/mobx';

import Card from '../../components/Card';
import { checkIsAdmintor } from '../../utils';
import { computeEstimates } from './utils';
import withBasicLayout from '../../utils/withBasicLayout';

import './index.less';

@withBasicLayout()
@inject('global')
@inject('hall')
@inject('estimate')
@observer
export default class Result extends Component {
  state = {
    actionSheetVisible: false,
  };

  showActionSheet = () => {
    const { actionSheetVisible } = this.state;
    this.setState({
      actionSheetVisible: !actionSheetVisible,
    });
  }

  handleActionSheetClosed = () => {
    this.setState({
      actionSheetVisible: false,
    });
  }

  restartEstimate = () => {
    const { estimate } = this.props;
    estimate.restartEstimate();
  }

  endEstimate = () => {
    const { estimate } = this.props;
    estimate.stopEstimate();
  }

  backToRoom = () => {
    const { hall } = this.props;
    hall.backToRoom();
  }

  renderEmptyContent = () => {

  }

  render() {
    const { actionSheetVisible } = this.state;
    const { hall, global, estimate } = this.props;
    const { user } = global;
    const { room } = hall;
    const { estimates, enableShowEstimateResult } = estimate;
    let content = (
      <View>
        <Text>当前未展示估时结果</Text>
        <AtButton onClick={this.backToRoom}>返回房间</AtButton>
      </View>
    );
    if (enableShowEstimateResult === true) {
      const isAdmintor = checkIsAdmintor({ user, room });
      const stat = computeEstimates(estimates);
      const estimateDetails = estimates
        .sort((a, b) => {
          return b.estimate - a.estimate;
        })
        .map(item => (
          <View key={item.name} className='result__detail'>
            <Text className='result__name'>{item.name}</Text>
            <Text className='result__value'>{item.estimate}</Text>
          </View>
        ));
      content = (
        <View>
          <Card title='统计'>
            {stat.map(s => (
              <View key={s.id} className='stats'>
                <Text className={`iconfont icon-weitaoshuzi${s.value} stats__value`}></Text>
                <Text className='stats__num'>{s.number}</Text>
              </View>
            ))}
          </Card>
          <Card title='详情'>
            {estimateDetails}
          </Card>
          {isAdmintor && (
            <View>
              <AtButton
                type='primary'
                onClick={this.restartEstimate}
              >重新开始估时</AtButton>
              <AtButton
                className='btn--stop-estimate'
                onClick={this.showActionSheet}
              >结束估时</AtButton>
            </View>
          )}
        </View>
      )
    }
    return (
      <View>
        <View className='page__content'>
          {content}
          <AtActionSheet
            isOpened={actionSheetVisible}
            cancelText='取消'
            onClose={this.handleActionSheetClosed}
          >
            <AtActionSheetItem onClick={this.endEstimate}>
              <Text style={{ color: 'red' }}>结束估时</Text>
            </AtActionSheetItem>
          </AtActionSheet>
        </View>
        <AtMessage />
      </View>
    );
  }
}

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
import { checkIsAdmintor, checkLogin, redirectLogin } from '../../utils';
import { computeEstimates } from './utils';
import withBasicLayout from '../../utils/withBasicLayout';

import './index.less';

@withBasicLayout()
@inject('global')
@observer
export default class Result extends Component {
  state = {
    actionSheetVisible: false,
  };

  componentDidMount() {
    const { global } = this.props;

    if (!checkLogin(global)) {
      redirectLogin();
      return;
    }
    global.init();
  }

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
    const { global } = this.props;
    global.restartEstimate();
  }

  endEstimate = () => {
    const { global } = this.props;
    global.stopEstimate();
  }

  render() {
    const { actionSheetVisible } = this.state;
    const { global } = this.props;
    const { room } = global;
    const estimates = room.members;
    const isAdmintor = checkIsAdmintor();
    const stat = computeEstimates(estimates);
    console.log(stat, estimates);
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
    return (
      <View>
        <View className='page__content'>
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
              <AtButton type='primary' onClick={this.restartEstimate}>重新开始估时</AtButton>
              <AtButton className='btn--stop-estimate' onClick={this.showActionSheet}>结束估时</AtButton>
            </View>
          )}
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

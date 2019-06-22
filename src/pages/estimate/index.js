/**
 * @file 选择点数
 */
import Taro, { Component } from '@tarojs/taro'
import {
  View,
} from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx';

import NumberBoard from '../../components/NumberBoard';
import withBasicLayout from '../../utils/withBasicLayout';

import './index.less'

@withBasicLayout()
@inject('global')
@inject('estimate')
@observer
export default class EstimateNumbers extends Component {
  config = {
    navigationBarTitleText: '选择点数'
  }

  selectNumber = (value) => {
    const { estimate } = this.props;
    estimate.updateEstimate(value);
  }

  render () {
    return (
      <View className='input-page'>
        <NumberBoard onClick={this.selectNumber} />
      </View>
    )
  }
}

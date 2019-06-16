import Taro, { Component } from '@tarojs/taro'
import {
  View,
} from '@tarojs/components'
import {
  AtAvatar,
  AtButton,
} from 'taro-ui'
import { observer, inject } from '@tarojs/mobx';

import HeadCard from '../../components/HeadCard';
import NumberBoard from '../../components/NumberBoard';
import { checkLogin, redirectLogin } from '../../utils';
import { estimate as estimatePath } from '../../constants';

import './index.less'

@inject('global')
@observer
export default class Index extends Component {
  config = {
    navigationBarTitleText: '首页'
  }
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { global } = this.props;
    if (!checkLogin(global)) {
      redirectLogin();
      return;
    }
  }

  selectNumber = (value) => {
    const { global } = this.props;
    const { client, estimate, roomId } = global;
    global.updateEstimate(value);
    let action = 'estimate'
    if (estimate !== undefined) {
      action = 'updateEstimate';
    }
    console.log('action', action);
    client.emit(action, { value, roomId });
    Taro.navigateTo({
      url: estimatePath,
    });
  }

  render () {
    return (
      <View className='input-page'>
        <HeadCard title="选择点数" desc="全部成员选择点数后展示结果" />
        <View className="input-page__content">
          <NumberBoard onClick={this.selectNumber} />
        </View>
      </View>
    )
  }
}

import Taro, { Component } from '@tarojs/taro'
import {
  View,
} from '@tarojs/components'
import {
  AtAvatar,
  AtButton,
} from 'taro-ui'
import { observer, inject } from '@tarojs/mobx';

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
      <View className='home-page'>
        <NumberBoard onClick={this.selectNumber} />
      </View>
    )
  }
}

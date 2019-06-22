import Taro from '@tarojs/taro';
import {
  View,
  Text,
} from '@tarojs/components';
import {
  AtButton,
  AtAvatar,
  AtActionSheet,
  AtActionSheetItem,
} from 'taro-ui';
import { observer, inject } from '@tarojs/mobx';

import HeadCard from '../../components/HeadCard';
import withBasicLayout from '../../utils/withBasicLayout';

import './index.less';

@withBasicLayout()
@inject('global')
@observer
export default class User extends Taro.Component {
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

  logout = () => {
    const { global } = this.props;
    global.logout();
  }

  render() {
    const { actionSheetVisible } = this.state;
    const { global: { user } } = this.props;
    return (
      <View>
        <HeadCard title='用户中心' desc='修改用户名或者注销' />
        <View className='page__content'>
          <View className='user__avatar-wrapper'>
            <AtAvatar size='large' className='user__avatar user__avatar--large' circle text={user.name}></AtAvatar>
            <Text className='user__name'>{user.name}</Text>
          </View>
          <AtButton type='danger' onClick={this.showActionSheet}>注销</AtButton>
        </View>
        <AtActionSheet
          isOpened={actionSheetVisible}
          cancelText='取消'
          onClose={this.handleActionSheetClosed}
        >
          <AtActionSheetItem onClick={this.logout}>
            <Text style={{ color: 'red' }}>注销</Text>
          </AtActionSheetItem>
        </AtActionSheet>
      </View>
    );
  }
}

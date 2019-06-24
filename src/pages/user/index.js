import Taro from '@tarojs/taro';
import {
  View,
  Text,
} from '@tarojs/components';
import {
  AtActionSheet,
  AtActionSheetItem,
  AtList,
  AtListItem,
} from 'taro-ui';
import { observer, inject } from '@tarojs/mobx';

import withBasicLayout from '../../utils/withBasicLayout';

import './index.less';
import UserListItem from '../../components/UserListItem';

@withBasicLayout()
@inject('global')
@inject('auth')
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
    const { auth } = this.props;
    auth.logout();
  }

  render() {
    const { actionSheetVisible } = this.state;
    const { global: { user } } = this.props;
    return (
      <View className='user-page'>
        <View className='user-page__content'>
          <AtList>
            <UserListItem user={user} />
            <AtListItem title='修改名称' arrow='right' />
            <AtListItem title='退出' onClick={this.showActionSheet} arrow='right' />
          </AtList>
        </View>
        <AtActionSheet
          isOpened={actionSheetVisible}
          cancelText='取消'
          onClose={this.handleActionSheetClosed}
        >
          <AtActionSheetItem onClick={this.logout}>
            <Text style={{ color: 'red' }}>确认退出</Text>
          </AtActionSheetItem>
        </AtActionSheet>
      </View>
    );
  }
}

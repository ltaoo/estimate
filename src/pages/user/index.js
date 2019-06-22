import Taro from '@tarojs/taro';
import {
  View,
  Text,
} from '@tarojs/components';
import {
  AtAvatar,
  AtActionSheet,
  AtActionSheetItem,
  AtList,
  AtListItem,
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
      <View className='user-page'>
        <HeadCard title='用户中心' desc='修改用户名或者注销' />
        <View className='user-page__content'>
          <AtList>
            <View className='at-list__item at-list__item--thumb at-list__item--multiple'>
              <View className='at-list__item-container'>
                <View className='at-list__item-thumb item-thumb item-avatar'>
                  <View className='taro-img item-thumb__info'>
                    <AtAvatar text={user.name}></AtAvatar>
                  </View>
                </View>
                <View className='at-list__item-content item-content'>
                  <View className='item-content__info'>
                    <View className='item-content__info-title'>{user.name}</View>
                    <View className='item-content__info-note'>标题文字</View>
                  </View>
                  <View className='at-list__item-extra item-extra'></View>
                </View>
              </View>
            </View>
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

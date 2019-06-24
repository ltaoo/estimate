import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtAvatar } from 'taro-ui';

export default class UserListItem extends Taro.Component {
  render() {
    const { user } = this.props;
    return (
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
              <View className='item-content__info-note'>{user.uuid}</View>
            </View>
            <View className='at-list__item-extra item-extra'></View>
          </View>
        </View>
      </View>
    );
  }
}

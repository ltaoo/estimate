import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import { observer, inject } from '@tarojs/mobx';
import {
  AtMessage,
  AtTabBar,
} from 'taro-ui';

import HeadCard from '../components/HeadCard';
import Skeleton from '../components/Skeleton';

export const tabList = [
  { iconType: 'home' },
  { iconType: 'lightning-bolt' },
  { iconType: 'user' }
];

export default () => {
  return (Component) => {
    class HOC extends Taro.Component {
      constructor(props) {
        super(props);
        console.log('call num');
        const { global } = this.props;
        global.init();
      }
      componentDidMount() {
        // if (!checkLogin(global)) {
        //   redirectLogin();
        //   return;
        // }
        // if (global.offlineMode === true) {
        //   redirectOfflineTipPage();
        // }
      }

      handleClickTabBar = (value) => {
        const { global } = this.props;
        global.changeTabBarIndex(value);
      }

      render() {
        const { global: { initial, client, loading, currentTabBarIndex } } = this.props;
        let content = (
          <Component {...this.props} />
        );
        console.log('basiclayout', client, loading);
        if (client === null && initial === true) {
          content = (
            <Skeleton rows={6} />
          );
        }
        return (
          <View className='basic-layout'>
            <HeadCard title='大厅' desc='加入已存在的房间或者创建房间' />
            {content}
            <AtMessage />
            <AtTabBar
              fixed
              tabList={tabList}
              onClick={this.handleClickTabBar}
              current={currentTabBarIndex}
            />
          </View>
        );
      }
    }

    const wrappedComponent = inject('global')(inject('auth')(observer(HOC)));
    return wrappedComponent;
  }
}

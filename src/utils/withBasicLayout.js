import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import { observer, inject } from '@tarojs/mobx';
import {
  AtMessage,
  AtTabBar,
} from 'taro-ui';

// import { checkLogin, redirectLogin, redirectOfflineTipPage } from './index';

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
        const { global: { currentTabBarIndex } } = this.props;
        return (
          <View className='basic-layout'>
            <Component {...this.props} />
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

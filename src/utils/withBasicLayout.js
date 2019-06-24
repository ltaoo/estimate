import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import { observer, inject } from '@tarojs/mobx';
import {
  AtMessage,
  AtTabBar,
} from 'taro-ui';

import { headCardProps } from '../constants/paths';
import { tabList } from '../constants';
import HeadCard from '../components/HeadCard';
import Skeleton from '../components/Skeleton';

import './index.less';

export default () => {
  return (Component) => {
    class HOC extends Taro.Component {
      constructor(props) {
        super(props);
        console.log('consturctor call time');

        const { global } = this.props;
        const currentPath = this.$router.path;
        global.resetInitial();
        global.init({ currentPath });
      }
      componentDidMount() {
        const { global } = this.props;
        setTimeout(() => {
          global.setInitial();
        }, 500);
      }

      componentWillUnmount() {
        console.log('basiclayout unmount');
        const { global } = this.props;
        global.resetInitial();
      }

      handleClickTabBar = (value) => {
        const { global } = this.props;
        global.changeTabBarIndex(value);
      }

      render() {
        const { global: { initial, client, currentTabBarIndex } } = this.props;
        let content = (
          <Component {...this.props} />
        );
        const { params, path } = this.$router;
        if (client === null && initial === true) {
          content = (
            <Skeleton rows={6} />
          );
        }
        const cardProps = headCardProps[path](params);
        return (
          <View className='basic-layout'>
            <HeadCard {...cardProps} />
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

    return inject('global')(observer(HOC));
  }
}

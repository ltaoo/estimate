import Taro from '@tarojs/taro';
import {
  View,
  Text,
} from '@tarojs/components';
import {
  AtTabBar,
} from 'taro-ui';
import { observer, inject } from '@tarojs/mobx';

import HeadCard from '../../components/HeadCard';
import { tabList } from '../../constants';

@inject('global')
@observer
export default class User extends Taro.Component {
  componentDidMount() {
    const { path } = this.$router;
    const { global } = this.props;
    global.changeTabBarIndex(path);
  }

  handleClickTabBar = (value) => {
    const { global } = this.props;
    global.changeTabBarIndex(value);
  }

  render() {
    const { global: { currentTabBarIndex } } = this.props;
    return (
      <View>
        <HeadCard title="用户中心" />
        <View className="page__content">
        </View>
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

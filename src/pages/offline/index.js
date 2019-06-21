import Taro from '@tarojs/taro';
import {
  View,
} from '@tarojs/components';
import {
  AtTabBar,
} from 'taro-ui';
import { observer, inject } from '@tarojs/mobx';

import NumberBoard from '../../components/NumberBoard';
import HeadCard from '../../components/HeadCard';
import { tabList } from '../../constants';
import { offlineEstimateCardPath } from '../../constants/paths';

@inject('global')
@observer
export default class OfflineEstimate extends Taro.Component {
  componentDidMount() {
    const { path } = this.$router;
    const { global } = this.props;
    global.changeTabBarIndex(path);
  }

  handleSelectNumber = (number) => {
    Taro.navigateTo({
      url: `${offlineEstimateCardPath}?number=${number}`,
    });
  }

  handleClickTabBar = (value) => {
    const { global } = this.props;
    global.changeTabBarIndex(value);
  }

  render() {
    const { global: { currentTabBarIndex } } = this.props;
    return (
      <View>
        <HeadCard title='离线估时' desc='点击后会以卡片展示点数' />
        <View className='page__content'>
          <NumberBoard onClick={this.handleSelectNumber} />
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

import Taro from '@tarojs/taro';
import {
  View,
  Text,
} from '@tarojs/components';

import HeadCard from '../../components/HeadCard';
import './index.less';

export default class OfflineEstimateResult extends Taro.Component {
  render() {
    const { number } = this.$router.params;
    return (
      <View>
        <HeadCard title="展示点数" desc="返回重新选择点数" />
        <View className="page__content">
          <View className="number-card--large">
            <span className={`iconfont icon-weitaoshuzi${number} number__text--full-card`} />
          </View>
        </View>
      </View>
    );
  }
}

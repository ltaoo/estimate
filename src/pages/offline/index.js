import Taro from '@tarojs/taro';
import {
  View,
  Text,
} from '@tarojs/components';

import NumberBoard from '../../components/NumberBoard';
import HeadCard from '../../components/HeadCard';
import { offlineEstimateCardPath } from '../../constants';

export default class OfflineEstimate extends Taro.Component {
  handleSelectNumber = (number) => {
    Taro.navigateTo({
      url: `${offlineEstimateCardPath}?number=${number}`,
    });
  }

  render() {
    return (
      <View>
        <HeadCard title="离线估时" desc="点击后会以卡片展示点数" />
        <View className="page__content">
          <NumberBoard onClick={this.handleSelectNumber} />
        </View>
      </View>
    );
  }
}

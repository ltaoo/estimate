import Taro from '@tarojs/taro';
import {
  View,
  Text,
} from '@tarojs/components';
import PropTypes from 'prop-types';

import './index.less';

const numbers = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];

export default class NumberBoard extends Taro.Component {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
  }

  shouldComponentUpdate() {
    return false;
  }

  handleClickNumber = (number) => {
    const { onClick } = this.props;
    onClick(number);
  }

  render() {
    return (
      <View className='numbers'>
        {numbers.map(rows => {
          return (
            <View className='at-row'>
              {rows.map(number => {
                return (
                  <View
                    onClick={this.handleClickNumber.bind(this, number)}
                    className='at-col number__wrapper'
                  >
                    <Text className={`iconfont icon-weitaoshuzi${number} number__text`} />
                  </View>
                );
              })}
            </View>
          );
        })}
      </View>
    );
  }
}

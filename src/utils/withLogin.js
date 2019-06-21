import Taro from '@tarojs/taro';
import { observer, inject } from '@tarojs/mobx';

import { checkLogin, redirectLogin } from './index';

export default () => {
  return (Component) => {
    class HOC extends Taro.Component {
      componentDidMount() {
        const { global } = this.props;

        if (!checkLogin(global)) {
          redirectLogin();
          return;
        }
      }
      render() {
        return (
          <Component {...this.props} />
        );
      }
    }

    const wrappedComponent = inject('global')(observer(HOC));
    return wrappedComponent;
  }
}

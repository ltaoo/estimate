import Taro from '@tarojs/taro';
import { observer, inject } from '@tarojs/mobx';

import { checkLogin, redirectLogin, redirectOfflineTipPage } from './index';

export default () => {
  return (Component) => {
    class HOC extends Taro.Component {
      componentDidMount() {
        const { global } = this.props;
        global.init();
        if (!checkLogin(global)) {
          redirectLogin();
          return;
        }
        if (global.offlineMode === true) {
          redirectOfflineTipPage();
        }
      }
      render() {
        return (
          <Component {...this.props} />
        );
      }
    }

    const wrappedComponent = inject('auth')(observer(HOC));
    return wrappedComponent;
  }
}

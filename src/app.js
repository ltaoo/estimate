import Taro, { Component } from '@tarojs/taro';
import { Provider, onError } from '@tarojs/mobx';
import 'taro-ui/dist/style/index.scss';

import Index from './pages/index';
import globalStore from './store';

import './app.less';
import './public/iconfont.css';

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

const store = {
  global: globalStore,
};

onError(error => {
  console.log('mobx global error listener:', error);
});

class App extends Component {

  config = {
    // 这些不能用常量替换
    pages: [
      'pages/index/index',
      'pages/login/index',
      // 输入估时
      'pages/estimate/index',
      'pages/estimate/numbers',
      'pages/estimate/result',
      // 大厅
      'pages/hall/index',
      'pages/hall/room',
      // 离线估时
      'pages/offline/index',
      'pages/offline/result',
      // 个人中心
      'pages/user/index',
      // 错误页
      'pages/errors/offline',
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    }
  }

  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'));

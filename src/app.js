import Taro, { Component } from '@tarojs/taro';
import 'taro-ui/dist/style/index.scss';
import { Provider, onError } from '@tarojs/mobx';

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
    pages: [
      'pages/index/index',
      'pages/login/index',
      // 输入估时
      'pages/input/index',
      // 估时点数
      'pages/estimate/index',
      // 估时结果
      'pages/result/index',
      // 大厅
      'pages/hall/index',
      // 房间
      'pages/room/index',
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

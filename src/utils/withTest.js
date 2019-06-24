import Taro from '@tarojs/taro';

export default () => {
  return (Component) => {
    class WrappedComponent extends Taro.Component {
      constructor(props) {
        super(props);

        console.log('hello constructor');
      }
      componentDidMount() {
        console.log('hello component did mouont');
      }
      render() {
        return (
          <Component {...this.props} />
        );
      }
    }
    return WrappedComponent;
  };
}

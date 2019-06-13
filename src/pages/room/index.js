import Taro, { Component } from '@tarojs/taro';
import {
  View,
  Text,
  Button,
} from '@tarojs/components';
import {
  AtGrid,
} from 'taro-ui';

import { socketUrl } from '../../constants';

const numbers = [
  {
    value: 1,
  },
  {
    value: 2,
  },
  {
    value: 3,
  },
  {
    value: 4,
  },
  {
    value: 5,
  },
  {
    value: 6,
  },
  {
    value: 7,
  },
  {
    value: 8,
  },
  {
    value: 9,
  },
];

export default class Room extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      number: '',
    };
  }

  componentDidMount() {
    const { username } = this.$router.params;
    this.connect(username);
    this.setState({
      username,
    });
  }

  connect = (username) => {
    // 连接 socket.io
    this.socket = io(socketUrl);
    this.socket.on('connect', () => {
      console.log('connect');
    });
    this.socket.on('global', this.handleGlobalEvent);
    this.socket.on('join', this.handleNewUserJoinToRoom);
    this.socket.on('estimate', this.getEstimate);
    this.socket.on('disconnect', () => {
      console.log('和服务器断开连接，请点击重连');
    });

    this.socket.emit('join', {
      username,
    });
  }

  handleClickNumber = ({ value }) => {
    const { number } = this.state;
    // 给出估时
    this.socket.emit('give_estimate', {
      value,
    });
    this.setState({
      number: value,
    });
  }

  ensureEstimate = () => {
    const { number } = this.state;
    this.socket.emit('estimate', {
      estimate: number,
    });
  }

  render() {
    const { number, username } = this.state;
    return (
      <View>
        <Text>username: {username}</Text>
        <View>
          <Text>{number}</Text>
        </View>
        <AtGrid onClick={this.handleClickNumber} data={numbers} />
        <Button type="primary" onClick={this.ensureEstimate}>确定</Button>
      </View>
    );
  }
}


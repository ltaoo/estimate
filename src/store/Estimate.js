import Taro from '@tarojs/taro';
import { observable } from 'mobx';

import {
  inputPath,
  estimatePath,
  resultPath,
} from '../constants/paths';
import { checkIsAdmintor } from '../utils';

export default class Estimate {
  // estimate
  estimate = undefined
  @observable showEstimate = false
  @observable estimates = []
  @observable estimatedMembers = []
  @observable unestimatedMembers = []

  constructor(global) {
    this.globalStore = global;
  }
  startEstimate() {
    const { client } = this.globalStore;
    if (client === null) {
      return;
    }
    client.emit('startEstimate');
  }
  updateEstimate(value) {
    const { client } = this.globalStore;
    if (client === null) {
      return;
    }
    this.estimate = value;
    client.emit('estimate', { value });
  }
  showEstimateResult() {
    const { client } = this.globalStore;
    if (client === null) {
      return;
    }
    client.emit('showEstimateResult');
  }
  restartEstimate() {
    const { client } = this.globalStore;
    if (client === null) {
      return;
    }
    client.emit('restartEstimate');
  }
  stopEstimate() {
    const { client } = this.globalStore;
    if (client === null) {
      return;
    }
    client.emit('stopEstimate');
  }
  addListeners(client) {
    client.on('startEstimateSuccess', ({ user, room }) => {
      this.globalStore.user = user;
      this.globalStore.hallStore.room = room;
    });
    client.on('globalStartEstimateSuccess', () => {
      this.globalStore.user.estimating = true;
      Taro.navigateTo({
        url: inputPath,
      });
    });
    client.on('backEstimateSuccess', () => {
      // this.globalStore.user = user;
      // this.globalStore.hallStore.room = room;
    });
    client.on('estimateSuccess', ({ user, room }) => {
      console.log(`${user.name} give estimate`);
      Taro.setStorageSync('user', user);
      this.globalStore.user = user;
      this.globalStore.hallStore.room = room;
      Taro.navigateTo({
        url: estimatePath,
      });
    });
    client.on('globalEstimateSuccess', ({ room, showEstimate }) => {
      const { user } = this.globalStore;

      this.globalStore.hallStore.room = room;
      const estimates = room.members;
      this.estimates = estimates;
      const estimatedMembers = [];
      const unestimatedMembers = [];
      for (let i = 0, l = estimates.length; i < l; i += 1) {
        if (estimates[i].estimate === null) {
          unestimatedMembers.push(estimates[i]);
        } else {
          estimatedMembers.push(estimates[i]);
        }
      }
      this.estimatedMembers = estimatedMembers;
      this.unestimatedMembers = unestimatedMembers;
      this.showEstimate = showEstimate;
      // 提示管理员所有人都给出了时间
      if (showEstimate && checkIsAdmintor({ user, room })) {
        console.log('所有人都给出时间了，可以展示结果');
      }
    });
    client.on('showEstimateResultSuccess', () => {
    });
    client.on('globalShowEstimateResultSuccess', () => {
      Taro.navigateTo({
        url: resultPath,
      });
    });
    client.on('restartEstimateSuccess', () => {
      console.log('restartEstimate');
      this.estimate = undefined;
      this.user.estimate = null;
      this.showEstimate = false;
      // Taro.redirectTo({
      //   url: inputPath,
      // });
    });
    client.on('stopEstimateSuccess', () => {
      console.log('stop estimate');
      this.estimate = undefined;
      this.user.estimate = null;
      this.user.estimating = true;
      this.user.joinedRoomId = null;
      this.user.createdRoomId = null;
      Taro.setStorageSync('user', this.user);
      this.showEstimate = false;
      // Taro.redirectTo({
      //   url: hallPath,
      // });
    });
  }
}

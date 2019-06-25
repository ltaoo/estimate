import Taro from '@tarojs/taro';
import { observable } from 'mobx';

import {
  hallPath,
  inputPath,
  estimatePath,
  resultPath,
} from '../constants/paths';
import { checkIsAdmintor, divideEstimates } from '../utils';

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
  clearEstimate() {
    const { client } = this.globalStore;
    if (client === null) {
      return;
    }
    console.log('emit clear estimate');
    client.emit('clearEstimate');
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
  updateEstimateResult(estimates) {
    this.estimates = estimates;
    const {
      estimatedMembers,
      unestimatedMembers,
    } = divideEstimates(estimates);
    this.estimatedMembers = estimatedMembers;
    this.unestimatedMembers = unestimatedMembers;
  }
  addListeners(client) {
    client.on('startEstimateSuccess', ({ user, room }) => {
      this.globalStore.user = user;
      this.globalStore.hallStore.room = room;
    });
    client.on('globalStartEstimateSuccess', () => {
      this.globalStore.user.estimating = true;
      if (this.globalStore.currentPath !== inputPath) {
        Taro.navigateTo({
          url: inputPath,
        });
      }
    });
    client.on('estimateSuccess', ({ user, room }) => {
      console.log(`${user.name} give estimate`);
      this.globalStore.user = user;
      this.globalStore.hallStore.room = room;
      console.log(this.globalStore.currentPath, estimatePath);
      if (this.globalStore.currentPath !== estimatePath) {
        Taro.navigateTo({
          url: estimatePath,
        });
      }
    });
    client.on('globalEstimateSuccess', ({ user, room, showEstimate }) => {
      console.log(`${user.name} 给出了估时`);
      const { user: self } = this.globalStore;
      this.globalStore.hallStore.room = room;
      const estimates = room.members;
      this.updateEstimateResult(estimates);
      this.showEstimate = estimates.every(e => e.estimate !== null);
      Taro.atMessage({
        type: 'info',
        message: `${user.name} 给出了估时`,
      });
      // 提示管理员所有人都给出了时间
      if (showEstimate && checkIsAdmintor({ user: self, room })) {
        console.log('所有人都给出时间了，可以展示结果');
        Taro.showModal({
          title: '展示结果',
          content: '所有人给出了估时，点击确定查看结果',
        })
          .then(({ confirm }) => {
            if (confirm) {
              client.emit('showEstimateResult');
            }
          });
      }
    });
    client.on('clearEstimateSuccess', ({ user }) => {
      console.log(`${user.name} 取消估时成功`);
      this.globalStore.user = user;
      Taro.navigateTo({
        url: inputPath,
      });
    });
    // 有用户想重新选择估时
    client.on('globalClearEstimateSuccess', ({ user, room }) => {
      console.log(`${user.name} 取消了估时`);
      this.globalStore.hallStore.room = room;
      this.updateEstimateResult(room.members);
      this.showEstimate = false;
      Taro.atMessage({
        type: 'info',
        message: `${user.name} 取消了估时`,
      });
    });

    client.on('showEstimateResultSuccess', () => {
      this.globalStore.user.showResult = true;
    });

    client.on('globalShowEstimateResultSuccess', ({ estimates }) => {
      console.log('show estimate result success', estimates);
      this.estimates = estimates;
      if (this.globalStore.currentPath !== resultPath) {
        Taro.navigateTo({
          url: resultPath,
        });
      }
    });

    client.on('globalRestartEstimateSuccess', () => {
      console.log('restart estimate');
      this.globalStore.user.estimate = null;
      this.globalStore.user.showResult = false;
      this.showEstimate = false;
      Taro.navigateTo({
        url: inputPath,
      });
    });
    client.on('globalStopEstimateSuccess', () => {
      this.estimate = undefined;
      this.globalStore.user.estimate = null;
      this.globalStore.user.estimating = false;
      this.globalStore.user.joinedRoomId = null;
      this.globalStore.user.createdRoomId = null;
      this.globalStore.user.showResult = false;
      this.showEstimate = false;
      Taro.redirectTo({
        url: hallPath,
      });
    });
  }
}

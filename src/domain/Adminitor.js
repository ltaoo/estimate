import User from './User';

export default class Member extends User {
  constructor(params) {
    super(params);
  }

  startEstimate() {
    if (this.hasCreatedRoom) {
      this.createdRoom.startEstimate();
    }
  }

  showEstimationResult() {
    if (this.hasCreatedRoom) {
      this.createdRoom.showEstimationResult();
    }
  }

  restartEstimate() {
    if (this.hasCreatedRoom) {
      this.createdRoom.restartEstimate();
    }
  }

  finishEstimate() {
    if (this.hasCreatedRoom) {
      this.createdRoom.finishEstimate();
    }
  }
}

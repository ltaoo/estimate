export default class Room {
  constructor(params) {
    const { id } = params;
    this.id = id;
    this.status = 'ENABLE';
    this.members = [];
  }

  addMember(member) {
    if (hasStartedPolicy(this)) {
      return;
    }
    this.members.push(member);
  }

  startEstimate() {
    this.status = 'STARTED';
    this.members.forEach((member) => {
      member.prepareEstimate();
    });
  }

  showEstimationResult() {
    this.members.forEach((member) => {
      member.endEstimate();
    });
  }

  restartEstimate() {
    this.members.forEach((member) => {
      member.prepareEstimate();
    });
  }

  showEstimationResult() {
    this.members.forEach((member) => {
      member.leaveRoom();
    });
  }
}

function hasStartedPolicy(room) {
  if (room.status === 'STARTED') {
    return true;
  }
  return false;
}

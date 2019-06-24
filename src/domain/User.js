import Room from './Room';

export default class User {
  static template = () => {
    return {
      id: null,
      name: null,
      uuid: null,
      joinedRoomId: null,
      createdRoomId: null,
      estimate: null,
      estimating: false,
      showResult: false,
    };
  }
  constructor(params) {
    const { id, uuid, name } = params;
    this.id = id;
    this.uuid = uuid;
    this.name = name;
    this.joinedRoomId = null;
    this.createdRoomId = null;
    this.estimate = null;
    this.estimating = null;
  }

  createRoom() {
    const createdRoom = new Room();
    this.createdRoom = createdRoom;
  }

  get hasCreatedRoom() {
    return this.createdRoomId !== null;
  }

  joinRoom(room) {
    this.joinedRoom = room;
    room.addMember(this);
  }

  get hasJoinedRoom() {
    return this.joinedRoom !== null;
  }

  leaveRoom() {
    this.joinedRoom.removeMember(this);
  }

  prepareEstimate() {
    this.estimating = true;
    this.estimation = null;
  }

  /**
   * @param {number} value - 给出的估时数
   */
  giveEstimation(value) {
    this.estimation = value;
  }

  clearEstimation() {
    this.estimation = null;
  }

  showEstimationResult() {
    this.estimating = false;
  }

  /**
   * 结束估时
   */
  finishEstimate() {

  }
}

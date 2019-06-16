export default class User {
  constructor(params) {
    const { id, name } = params;
    this.id = id;
    this.name = name;
  }
}

class AbstractList {
  constructor() {
    this.list;
  }

  getList() {
    if (this.list === null || this.list === undefined) {
      this.list = JSON.parse(window.localStorage.getItem(this.constructor.name)) || {};
    }

    return this.list;
  }

  getItem (id) {
    if (this.list === null || this.list === undefined) {
      this.getList();
    }

    return this.list[id];
  }

  updateItem (id, item) {
    this.list[id] = item;
    this.store();
  }

  store() {
    window.localStorage.setItem(this.constructor.name, JSON.stringify(this.list));
  }
}

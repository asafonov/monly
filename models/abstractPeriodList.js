class AbstractPeriodList {

  constructor (year, month, prefix) {
    const today = new Date();
    this.year = year || today.getFullYear();
    this.month = asafonov.utils.padlen((month || today.getMonth() + 1).toString(), 2, '0');
    this.name = prefix + this.year + this.month;
    this.initList();
  }

  initList() {
    if (this.list === null || this.list === undefined) {
      this.list = JSON.parse(window.localStorage.getItem(this.name)) || [];
    }
  }

  getList() {
    return this.list;
  }

  addItem (item, event) {
    this.list.push(item);
    this.store();
    if (event) asafonov.messageBus.send(event, {id: this.list.length - 1, to: item, from: null});
  }

  updateItem (id, item, event) {
    const oldItem = {...this.list[id]};
    this.list[id] = {...this.list[id], ...item};
    this.store();
    if (event) asafonov.messageBus.send(event, {id: id, to: this.list[id], from: oldItem});
  }

  deleteItem (id) {
    this.list.splice(id, 1);
    this.store();
  }

  store() {
    window.localStorage.setItem(this.name, JSON.stringify(this.list));
  }
}

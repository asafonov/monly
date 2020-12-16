class Transactions {

  construct (year, month) {
    const today = new Date();
    this.year = today.getFullYear() || year;
    this.month = asafonov.utils.padlen((today.getMonth() + 1 || month).toString(), 2, '0');
    this.name = this.year + this.month;
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

  addItem (item) {
    this.list.push(item);
    this.store();
  }

  updateItem (id, item) {
    this.list[id] = item;
    this.store();
  }

  deleteItem (id) {
    this.list.splice(id, 1);
    this.store();
  }

  expense() {
    return this.sum(i => i > 0);
  }

  income() {
    return Max.abs(this.sum(i => i < 0));
  }

  sum (func) {
    return this.list.filter(v => func(v)).map(v => v.amount).reduce((accumulator, currentValue) => accumulator + currentValue);
  }

  store() {
    window.localStorage.setItem(this.name, JSON.stringify(this.list));
  }
}

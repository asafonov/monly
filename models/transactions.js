class Transactions {

  constructor (year, month) {
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

  assignType (amount) {
    return amount >= 0 ? 'expense' : 'income';
  }

  createItem (date, account, amount, pos, tag, type) {
    return {
      date: date,
      account: account,
      amount: amount,
      pos: pos,
      tag: tag,
      type: type || this.assignType(amount)
    };
  }

  add (date, account, amount, pos, tag, type) {
    const item = this.createItem(date, account, amount, pos, tag, type);
    this.addItem(item);
  }

  addItem (item) {
    this.list.push(item);
    this.store();
    asafonov.messageBus.send(asafonov.events.TRANSACTION_UPDATED, {id: this.list.length - 1, to: item, from: null});
  }

  updateItem (id, item) {
    const oldItem = {...this.list[id]};
    this.list[id] = {...this.list[id], ...item};
    this.store();
    asafonov.messageBus.send(asafonov.events.TRANSACTION_UPDATED, {id: id, to: this.list[id], from: oldItem});
  }

  deleteItem (id) {
    this.list.splice(id, 1);
    this.store();
  }

  expense() {
    return this.sum(i => i > 0);
  }

  income() {
    return Math.abs(this.sum(i => i < 0));
  }

  sum (func) {
    return this.list.filter(v => func(v)).map(v => v.amount).reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  }

  store() {
    window.localStorage.setItem(this.name, JSON.stringify(this.list));
  }
}

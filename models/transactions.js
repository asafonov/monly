class Transactions extends AbstractPeriodList {

  constructor (year, month) {
    super(year, month, '');
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
    super.addItem(item, asafonov.events.TRANSACTION_UPDATED);
  }

  updateItem (id, item) {
    super.updateItem(id, item, asafonov.events.TRANSACTION_UPDATED);
  }

  deleteItem (id) {
    super.deleteItem(id);
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
}

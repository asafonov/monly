class Transactions extends AbstractPeriodList {

  constructor (year, month) {
    super(year, month, 'transactions_', asafonov.events.TRANSACTIONS_LOADED)
    this.settings = new Settings()
  }

  assignType (amount) {
    return amount >= 0 ? 'expense' : 'income'
  }

  createItem (date, account, amount, pos, tag, type) {
    return {
      date: date,
      account: account,
      amount: amount,
      pos: pos,
      tag: tag.trim(),
      type: type || this.assignType(amount)
    }
  }

  add (date, account, amount, pos, tag, type) {
    const item = this.createItem(date, account, amount, pos, tag, type)
    this.addItem(item)
  }

  addItem (item) {
    super.addItem(item, asafonov.events.TRANSACTION_UPDATED)
  }

  updateItem (id, item) {
    if (item.amount !== undefined && item.amount !== null) {
      item.type = this.assignType(item.amount)
    }

    super.updateItem(id, item, asafonov.events.TRANSACTION_UPDATED)
  }

  deleteItem (id) {
    super.deleteItem(id)
  }

  getSumsByTags() {
    const tags = {}
    const accountRate = this.settings.getItem('account_rate')

    for (let i = 0; i < this.list.length; ++i) {
      tags[this.list[i].tag] = (tags[this.list[i].tag] || 0) + this.list[i].amount * (accountRate[this.list[i].account] || 1)
    }

    return tags
  }

  income() {
    const tags = this.getSumsByTags()
    let sum = 0

    for (let i in tags) {
      sum += tags[i] < 0 ? -1 * tags[i] : 0
    }

    return sum
  }

  expense() {
    const tags = this.getSumsByTags()
    let sum = 0

    for (let i in tags) {
      sum += tags[i] > 0 ? tags[i] : 0
    }

    return sum
  }

  sumByTag (tag) {
    return this.sum(i => i.tag === tag)
  }

  sum (func) {
    const accountRate = this.settings.getItem('account_rate')
    return this.list.filter(v => func(v)).map(v => v.amount * (accountRate[v.account] || 1)).reduce((accumulator, currentValue) => accumulator + currentValue, 0)
  }
}

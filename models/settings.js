class Settings extends AbstractList {

  constructor (list) {
    super({
      mainscreen: {
        accounts: true,
        review: true,
        budget: true,
        transactions: true
      },
      default_account: null,
      default_currency: 'USD',
      account_rate: {},
      categories: ['Groceries', 'Transport', 'Travel', 'Utilities', 'Gas', 'Health', 'Fun', 'Presents', 'Clothes'],
      theme: 'light',
      show_update_dialog: false
    })
  }

  async initCurrencyRates() {
    const currency = new Currency()

    for (let k in this.list.account_rate) {
      const rate = await currency.initRate(this.list.account_rate[k])
      this.list.account_rate[k] = rate
    }
  }

}

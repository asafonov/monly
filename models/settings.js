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
      account_rate: {}
    })
  }

  async initCurrencyRates() {
    const currency = new Currency()

    for (let k in this.list.account_rate) {
      if (this.list.account_rate[k]?.length === 6 && ! this.list.account_rate[k].match(/[^A-z]/g)) {
        const base = this.list.account_rate[k].substr(0, 3)
        const symbol = this.list.account_rate[k].substr(3)
        const rate = await currency.convert(base, symbol)
        this.list.account_rate[k] = parseFloat(rate)
      }
    }
  }

}

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

}

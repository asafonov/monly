class Settings extends AbstractList {

  constructor (list) {
    super({
      mainscreen: {
        accounts: true,
        review: true,
        budget: true,
        transactions: true
      }
    })
  }

}

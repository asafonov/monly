class Settings extends AbstractList {

  constructor (year, month) {
    super({
      mainscreen: {
        accounts: true,
        review: true,
        budget: true
      }
    })
  }

}

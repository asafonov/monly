class Reports extends AbstractPeriodList {

  constructor (year, month) {
    super(year, month, 'reports_');
  }

  build (removeSource) {
    const transactions = new Transactions(this.year, this.month);

    if (transactions.length() === 0) {
      transactions.destroy();
      return;
    }

    this.clear();
    const tags = new Set(transactions.getList().map(i => i.tag));
    let item = {};

    for (let i of tags) {
      item[i] = transactions.sumByTag(i);
    }

    this.addItem(item);

    if (removeSource) transactions.clear();

    transactions.destroy();
  }

}

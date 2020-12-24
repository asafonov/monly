class Budgets extends AbstractPeriodList {

  constructor (year, month) {
    super(year, month, 'budgets_');
  }

  addItem (item) {
    super.addItem(item, asafonov.events.BUDGET_UPDATED);
  }

  updateItem (id, item) {
    super.updateItem(id, item, asafonov.events.BUDGET_UPDATED);
  }
}

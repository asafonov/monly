class TransactionsView {

  constructor() {
    this.listElement = document.querySelector('.transactions');
    this.incomeElement = document.querySelector('.income');
    this.expenseElement = document.querySelector('.expense');
    this.model = new Transactions();
  }

  updateTotal() {
    this.incomeElement.innerHTML = asafonov.utils.displayMoney(this.model.income());
    this.expenseElement.innerHTML = asafonov.utils.displayMoney(this.model.expense());
  }

  clearExistingItems() {
    const items = this.listElement.querySelectorAll('.item');

    for (let i = 0; i < items.length; ++i) {
      this.listElement.removeChild(items[i]);
    }
  }

  renderItem() {
  }

  updateList() {
    this.clearExistingItems();
    this.updateTotal();
    const list = this.model.getList();

    for (let i = 0; i < list.length; ++i) {
      this.renderItem(list[i]);
    }
  }

}

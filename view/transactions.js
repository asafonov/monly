class TransactionsView {

  construct() {
    this.incomeElement = document.querySelector('.income');
    this.expenseElement = document.querySelector('.expense');
  }

  updateTotal() {
    this.incomeElement.innerHTML = asafonov.utils.displayMoney(this.model.income());
    this.expenseElement.innerHTML = asafonov.utils.displayMoney(this.model.expense());
  }

  updateList() {
    this.clearExistingItems();
    const list = this.model.getList();
    this.updateTotal();

    for (let i = 0; i < list.length; ++i) {
      this.renderItem(list[i]);
    }
  }

}

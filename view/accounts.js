class AccountsView {
  constructor() {
    this.model = new Accounts(
      {Yandex: 300000, Alfa: 4142181} // test data
    );
    this.listElement = document.querySelector('.accounts');
  }

  clearExistingItems() {
    const items = this.listElement.querySelectorAll('.item');

    for (let i = 0; i < items.length; ++i) {
      this.listElement.removeChild(items[i]);
    }
  }

  initList() {
    this.clearExistingItems();
    const list = this.model.getList();
    const addButton = this.listElement.querySelector('.add');
    const totalElement = this.listElement.querySelector('.number.big');
    let total = 0;

    for (let key in list) {
      const item = document.createElement('div');
      item.className = 'item';
      const title = document.createElement('div');
      title.innerHTML = key;
      item.appendChild(title);
      const value = document.createElement('div');
      value.className = 'number';
      value.innerHTML = asafonov.utils.displayMoney(list[key]);
      item.appendChild(value);
      this.listElement.insertBefore(item, addButton);
      total += list[key];
    }

    totalElement.innerHTML = asafonov.utils.displayMoney(total);
  }
}

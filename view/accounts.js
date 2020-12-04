class AccountsView {
  constructor() {
    this.model = new Accounts(
      {Yandex: 300000, Alfa: 4142181} // test data
    );
    this.onAddButtonClickedProxy = this.onAddButtonClicked.bind(this);
    this.listElement = document.querySelector('.accounts');
    this.addButton = this.listElement.querySelector('.add');
    this.addEventListeners();
  }

  addEventListeners() {
    this.updateEventListeners(true);
  }

  removeEventListeners() {
    this.updateEventListeners();
  }

  updateEventListeners (add) {
    this.addButton[add ? 'addEventListener' : 'removeEventListener']('click', this.onAddButtonClickedProxy);
  }

  onAddButtonClicked() {
    this.renderItem('New Account', 0);
  }

  clearExistingItems() {
    const items = this.listElement.querySelectorAll('.item');

    for (let i = 0; i < items.length; ++i) {
      this.listElement.removeChild(items[i]);
    }
  }

  renderItem (name, amount) {
    const item = document.createElement('div');
    item.className = 'item';
    const title = document.createElement('div');
    title.setAttribute('contenteditable', 'true');
    title.innerHTML = name;
    item.appendChild(title);
    const value = document.createElement('div');
    value.className = 'number';
    value.innerHTML = asafonov.utils.displayMoney(amount);
    item.appendChild(value);
    this.listElement.insertBefore(item, this.addButton);
  }

  updateList() {
    this.clearExistingItems();
    const list = this.model.getList();
    const totalElement = this.listElement.querySelector('.number.big');
    let total = 0;

    for (let key in list) {
      this.renderItem(key, list[key]);
      total += list[key];
    }

    totalElement.innerHTML = asafonov.utils.displayMoney(total);
  }

  destroy() {
    this.removeEventListeners();
    this.addButton = null;
    this.listElement = null;
  }
}

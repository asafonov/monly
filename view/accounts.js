class AccountsView {
  constructor() {
    this.model = new Accounts(
      {Account1: 300000, Account2: 4142181} // test data
    );
    this.onAddButtonClickedProxy = this.onAddButtonClicked.bind(this);
    this.onAccountTitleChangedProxy = this.onAccountTitleChanged.bind(this);
    this.onAccountValueChangedProxy = this.onAccountValueChanged.bind(this);
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
    title.className = 'title';
    title.setAttribute('contenteditable', 'true');
    title.innerHTML = name;
    title.addEventListener('focus', event => event.currentTarget.setAttribute('data-content', event.currentTarget.innerHTML));
    title.addEventListener('blur', this.onAccountTitleChangedProxy);
    item.appendChild(title);
    const value = document.createElement('div');
    value.className = 'number';
    value.innerHTML = asafonov.utils.displayMoney(amount);
    value.setAttribute('contenteditable', 'true');
    value.addEventListener('focus', event => event.currentTarget.setAttribute('data-content', event.currentTarget.innerHTML));
    value.addEventListener('blur', this.onAccountValueChangedProxy);
    item.appendChild(value);
    this.listElement.insertBefore(item, this.addButton);
  }

  onAccountTitleChanged (event) {
    const title = event.currentTarget;
    const newValue = title.innerHTML;
    const originalValue = title.getAttribute('data-content');

    if (newValue !== originalValue) {
      this.model.updateId(originalValue, newValue);
    }
  }

  onAccountValueChanged (event) {
    const value = event.currentTarget;
    const title = value.parentNode.querySelector('.title');
    const newValue = value.innerHTML;
    const originalValue = value.getAttribute('data-content');

    if (newValue !== originalValue) {
      const amount = parseInt(parseFloat(newValue) * 100);
      this.model.updateItem(title.innerHTML, amount);
      value.innerHTML = asafonov.utils.displayMoney(amount);
      this.updateTotal();
    }
  }

  updateList() {
    this.clearExistingItems();
    const list = this.model.getList();
    this.updateTotal();

    for (let key in list) {
      this.renderItem(key, list[key]);
    }
  }

  updateTotal() {
    const list = this.model.getList();
    const totalElement = this.listElement.querySelector('.number.big');
    let total = 0;

    for (let key in list) {
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

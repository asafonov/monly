class BudgetsView {

  constructor() {
    this.model = new Budgets();
    this.onAddButtonClickedProxy = this.onAddButtonClicked.bind(this);
    this.onTitleChangedProxy = this.onTitleChanged.bind(this);
    this.onValueChangedProxy = this.onValueChanged.bind(this);
    this.listElement = document.querySelector('.budgets');
    this.addButton = this.listElement.querySelector('.add');
    this.totalElement = this.listElement.querySelector('.number.big');
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
    asafonov.messageBus[add ? 'subscribe' : 'unsubscribe'](asafonov.events.BUDGET_UPDATED, this, 'onBudgetUpdated');
    asafonov.messageBus[add ? 'subscribe' : 'unsubscribe'](asafonov.events.BUDGET_RENAMED, this, 'onBudgetRenamed');
    asafonov.messageBus[add ? 'subscribe' : 'unsubscribe'](asafonov.events.TRANSACTIONS_LOADED, this, 'onTransactionsLoaded');
  }

  onAddButtonClicked() {
    const name = 'Budget' + Math.floor(Math.random() * 1000)
    this.model.updateItem(name, 0);
  }

  onBudgetUpdated (event) {
    this.renderItem(event.id, event.to);
    this.updateTotal();
  }

  onBudgetRenamed (event) {
    const oldId = this.genItemId(event.from);
    const newId = this.genItemId(event.to);
    document.querySelector(`#${oldId}`).id = newId;
    this.renderItem(event.to, event.item);
  }

  onTransactionsLoaded (event) {
    const list = this.model.getList();

    for (let tag in list) {
      this.updateBudgetCompletion(tag, event.list.sumByTag(tag));
    }
  }

  updateBudgetCompletion (tag, sum) {
  }

  clearExistingItems() {
    const items = this.listElement.querySelectorAll('.item');

    for (let i = 0; i < items.length; ++i) {
      this.listElement.removeChild(items[i]);
    }
  }

  genItemId (name) {
    return `budget_${name}`;
  }

  renderItem (name, amount) {
    let itemExists = true;
    const itemId = this.genItemId(name);
    let item = this.listElement.querySelector(`#${itemId}`);

    if (! item) {
      item = document.createElement('div');
      itemExists = false;
      item.id = itemId;
      item.className = 'item';
    }

    item.innerHTML = '';
    const displayAmount = asafonov.utils.displayMoney(amount);
    const displayZero = asafonov.utils.displayMoney(0);

    const row = document.createElement('div');
    row.className = 'row';
    row.innerHTML = `<div>${name}</div><div class="number with_left">${displayAmount}</div>`;
    item.appendChild(row);

    const row2 = document.createElement('div');
    row2.className = 'row number dual';
    row2.innerHTML = `${displayZero} <span>${displayAmount}</span>`;
    item.appendChild(row2);

    const row3 = document.createElement('div');
    row3.className = 'row progress_line';
    row3.innerHTML = '<div class="filled"></div>';
    item.appendChild(row3);

    if (! itemExists) {
      this.listElement.insertBefore(item, this.addButton);
    }
  }

  onTitleChanged (event) {
    const title = event.currentTarget;
    const newValue = title.innerText.replace(/\n/g, '');
    const originalValue = title.getAttribute('data-content');

    if (newValue !== originalValue) {
      if (newValue.length > 0) {
        this.model.updateId(originalValue, newValue);
      } else {
        this.model.deleteItem(originalValue);
        this.updateList();
      }
    }
  }

  onValueChanged (event) {
    const value = event.currentTarget;
    const title = value.parentNode.querySelector('.title');
    const newValue = value.innerText.replace(/\n/g, '');
    const originalValue = value.getAttribute('data-content');

    if (newValue !== originalValue) {
      const amount = parseInt(parseFloat(newValue) * 100);
      this.model.updateItem(title.innerHTML, amount);
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
    let total = 0;

    for (let key in list) {
      total += list[key];
    }

    this.totalElement.innerHTML = asafonov.utils.displayMoney(total);
  }

  destroy() {
    this.removeEventListeners();
    this.model.destroy();
    this.addButton = null;
    this.listElement = null;
    this.totalElement = null;
  }
}

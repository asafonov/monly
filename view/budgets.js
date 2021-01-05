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
      this.updateBudgetCompletion(tag, list.sumByTag(tag));
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
    const title = document.createElement('div');
    title.className = 'title';
    title.setAttribute('contenteditable', 'true');
    title.innerHTML = name;
    title.addEventListener('focus', event => event.currentTarget.setAttribute('data-content', event.currentTarget.innerText.replace(/\n/g, '')));
    title.addEventListener('blur', this.onAccountTitleChangedProxy);
    item.appendChild(title);
    const value = document.createElement('div');
    value.className = 'number';
    value.innerHTML = asafonov.utils.displayMoney(amount);
    value.setAttribute('contenteditable', 'true');
    value.addEventListener('focus', event => event.currentTarget.setAttribute('data-content', event.currentTarget.innerText.replace(/\n/g, '')));
    value.addEventListener('blur', this.onAccountValueChangedProxy);
    item.appendChild(value);

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

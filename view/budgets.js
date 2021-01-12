class BudgetsView {

  constructor() {
    this.model = new Budgets();
    this.transactions = null;
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
    asafonov.messageBus[add ? 'subscribe' : 'unsubscribe'](asafonov.events.TRANSACTION_UPDATED, this, 'onTransactionUpdated');
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
    this.transactions = event.list;
    this.updateTotal();

    for (let tag in list) {
      this.updateBudgetCompletion(tag, event.list.sumByTag(tag));
    }
  }

  onTransactionUpdated (event) {
    let affectedTags = [event.to.tag];
    event.from && event.from.tag !== event.to.tag && (affectedTags.push(event.from.tag));

    for (let i = 0; i < affectedTags.length; ++i) {
      if (this.model.getItem(affectedTags[i]) !== undefined) {
        this.updateBudgetCompletion(affectedTags[i], this.transactions.sumByTag(affectedTags[i]));
        this.updateTotal();
      }
    }
  }

  updateBudgetCompletion (tag, sum) {
    const itemId = this.genItemId(tag);
    const item = this.listElement.querySelector(`#${itemId}`);
    const budget = asafonov.utils.displayMoney(this.model.getItem(tag));
    const left = asafonov.utils.displayMoney(this.model.getItem(tag) - sum);
    const spent = asafonov.utils.displayMoney(sum);

    item.querySelector(`.number.with_left`).innerHTML = left;
    item.querySelector('.row.number.dual').innerText = `${spent} `;
    const v = document.createElement('span');
    v.setAttribute('contenteditable', 'true');
    v.innerHTML = budget;
    v.addEventListener('focus', event => event.currentTarget.setAttribute('data-content', event.currentTarget.innerText.replace(/\n/g, '')));
    v.addEventListener('blur', this.onValueChangedProxy);
    item.querySelector('.row.number.dual').appendChild(v);
    const width = Math.min(100, parseInt(sum / this.model.getItem(tag) * 100)) || 100;
    item.querySelector('.filled').style.width = `${width}%`;
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
    const n = document.createElement('div');
    n.className = 'budget_name';
    n.innerHTML = name;
    n.addEventListener('focus', event => event.currentTarget.setAttribute('data-content', event.currentTarget.innerText.replace(/\n/g, '')));
    n.addEventListener('blur', this.onTitleChangedProxy);
    n.setAttribute('contenteditable', 'true');
    row.appendChild(n);
    const a = document.createElement('div');
    a.className = 'number with_left';
    a.innerHTML = displayAmount;
    row.appendChild(a);
    item.appendChild(row);

    const row2 = document.createElement('div');
    row2.className = 'row number dual';
    row2.innerHTML = `${displayZero} `;
    const v = document.createElement('span');
    v.innerHTML = displayAmount;
    row2.appendChild(v);
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
    const title = value.parentNode.parentNode.querySelector('.budget_name');
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

    for (let key in list) {
      this.renderItem(key, list[key]);
    }
  }

  updateTotal() {
    const list = this.model.getList();
    let total = 0;

    for (let key in list) {
      total += list[key] - this.transactions.sumByTag(key);
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

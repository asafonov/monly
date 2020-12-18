class TransactionsView {

  constructor() {
    this.listElement = document.querySelector('.transactions');
    this.addButton = this.listElement.querySelector('.add');
    this.incomeElement = document.querySelector('.income');
    this.expenseElement = document.querySelector('.expense');
    this.onAddButtonClickedProxy = this.onAddButtonClicked.bind(this);
    this.onAmountChangedProxy = this.onAmountChanged.bind(this);
    this.model = new Transactions();
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
    const item = this.model.add(
      (new Date()).toISOString().substr(0, 10),
      asafonov.accounts.getDefault(),
      0,
      'Point of sale',
      'Groceries'
    );
    this.renderItem(item, this.model.getList().length);
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

  onAmountChanged (event) {
    const element = event.currentTarget;
    const newValue = element.innerText.replace(/\n/g, '');
    const originalValue = element.getAttribute('data-content');
    const id = element.parentNode.parentNode.getAttribute('data-id');

    if (newValue !== originalValue) {
      const amount = parseInt(parseFloat(newValue) * 100);
      this.model.updateItem(id, {amount: amount});
      value.innerHTML = asafonov.utils.displayMoney(amount);
      this.updateTotal();
    }
  }

  renderItem (item, i) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'item';
    itemDiv.setAttribute('data-id', i);

    const row1 = document.createElement('div');
    row1.className = 'row';

    const dateDiv = document.createElement('div');
    dateDiv.className = 'first_coll';
    dateDiv.innerHTML = item.date;
    row1.appendChild(dateDiv);

    const accountDiv = document.createElement('div');
    accountDiv.className = 'second_coll small';
    accountDiv.innerHTML = item.account;
    row1.appendChild(accountDiv);

    const amountDiv = document.createElement('div');
    amountDiv.className = 'third_coll number';
    amountDiv.innerHTML = asafonov.utils.displayMoney(item.amount);
    amountDiv.setAttribute('contenteditable', 'true');
    amountDiv.addEventListener('focus', event => event.currentTarget.setAttribute('data-content', event.currentTarget.innerText.replace(/\n/g, '')));
    amountDiv.addEventListener('blur', this.onAmountChangedProxy);
    row1.appendChild(amountDiv);
    itemDiv.appendChild(row1);

    const row2 = document.createElement('div');
    row2.className = 'row';

    const posDiv = document.createElement('div');
    posDiv.className = 'first_coll small';
    posDiv.innerHTML = item.pos;
    row2.appendChild(posDiv);

    const tagDiv = document.createElement('div');
    tagDiv.className = 'second_coll small';
    tagDiv.innerHTML = item.tag;
    row2.appendChild(tagDiv);

    const icoDiv = document.createElement('div');
    icoDiv.className = 'third_coll ico_container';
    row2.appendChild(icoDiv);
    const ico = document.createElement('div');
    ico.className = 'svg';
    ico.classList.add('trans_' + item.type);
    icoDiv.appendChild(ico);
    itemDiv.appendChild(row2);

    this.listElement.insertBefore(itemDiv, this.addButton);
  }

  updateList() {
    this.clearExistingItems();
    this.updateTotal();
    const list = this.model.getList();

    for (let i = 0; i < list.length; ++i) {
      this.renderItem(list[i], i);
    }
  }

  destroy() {
    this.removeEventListeners();
    this.model.destroy();
    this.addButton = null;
    this.listElement = null;
    this.incomeElement = null;
    this.expenseElement = null;
  }
}

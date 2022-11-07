class TransactionsView {

  constructor() {
    this.reviewElement = document.querySelector('.review')
    const settings = asafonov.settings
    const mainscreen = settings.getItem('mainscreen')
    this.isReviewEnabled = mainscreen.review

    if (! this.isReviewEnabled) {
      this.reviewElement.parentNode.removeChild(this.reviewElement)
    }

    this.model = new Transactions()
    this.listElement = document.querySelector('.transactions')
    this.isTransactionsEnabled = mainscreen.transactions

    if (! this.isTransactionsEnabled) {
      this.listElement.parentNode.removeChild(this.listElement)
      return
    }

    this.headerElement = this.listElement.querySelector('h1')
    this.addButton = this.listElement.querySelector('.add_link')
    this.incomeElement = document.querySelector('.income')
    this.expenseElement = document.querySelector('.expense')
    this.onAddButtonClickedProxy = this.onAddButtonClicked.bind(this)
    this.onAmountChangedProxy = this.onAmountChanged.bind(this)
    this.onAccountClickedProxy = this.onAccountClicked.bind(this)
    this.onTagClickedProxy = this.onTagClicked.bind(this)
    this.onItemDataChangedProxy = this.onItemDataChanged.bind(this)
    this.closePopupProxy = this.closePopup.bind(this)
    this.addEventListeners()
  }

  addEventListeners() {
    this.updateEventListeners(true)
  }

  removeEventListeners() {
    this.updateEventListeners()
  }

  updateEventListeners (add) {
    this.addButton[add ? 'addEventListener' : 'removeEventListener']('click', this.onAddButtonClickedProxy)
    asafonov.messageBus[add ? 'subscribe' : 'unsubscribe'](asafonov.events.TRANSACTION_UPDATED, this, 'onTransactionUpdated')
  }

  onTransactionUpdated (event) {
    this.renderItem (event.to, event.id)
    this.updateTotal()
  }

  onAddButtonClicked() {
    this.model.add(
      (new Date()).toISOString().substr(0, 10),
      asafonov.accounts.getDefault(),
      0,
      'Point of sale',
      'Groceries'
    )
  }

  updateTotal() {
    if (! this.isReviewEnabled) return

    this.incomeElement.innerHTML = asafonov.utils.displayMoney(this.model.income())
    this.expenseElement.innerHTML = asafonov.utils.displayMoney(this.model.expense())
  }

  clearExistingItems() {
    const items = this.listElement.querySelectorAll('.item')

    for (let i = 0; i < items.length; ++i) {
      this.listElement.removeChild(items[i])
    }
  }

  onAccountSelected (event) {
    const account = event.currentTarget.innerHTML
    const id = event.currentTarget.getAttribute('data-id')
    this.model.updateItem(id, {account: account})
    event.stopPropagation()
  }

  onTagSelected (event) {
    const tag = event.currentTarget.innerHTML
    const id = event.currentTarget.getAttribute('data-id')
    this.model.updateItem(id, {tag: tag})
    event.stopPropagation()
  }

  onAmountChanged (event) {
    const element = event.currentTarget
    const newValue = element.innerText.replace(/\n/g, '')
    const originalValue = element.getAttribute('data-content')
    const id = element.parentNode.parentNode.getAttribute('data-id')

    if (newValue !== originalValue) {
      const amount = Math.round(parseFloat(newValue) * 100)
      this.model.updateItem(id, {amount: amount})
    }
  }

  onItemDataChanged (event) {
    const element = event.currentTarget
    const newValue = element.innerText.replace(/\n/g, '')
    const originalValue = element.getAttribute('data-content')
    const id = element.parentNode.parentNode.getAttribute('data-id')
    const name = element.getAttribute('data-name')

    if (newValue !== originalValue) {
      let data = {}
      data[name] = newValue
      this.model.updateItem(id, data)
    }
  }

  genItemId (id) {
    return `item_${id}`
  }

  renderItem (item, i) {
    const itemId = this.genItemId(i)
    let itemDiv = this.listElement.querySelector(`#${itemId}`)
    let itemAdded = true

    if (! itemDiv) {
      itemDiv = document.createElement('div')
      itemDiv.className = 'item'
      itemDiv.setAttribute('data-id', i)
      itemDiv.id = itemId
      itemAdded = false
    }

    itemDiv.innerHTML = ''

    const row1 = document.createElement('div')
    row1.className = 'row'

    const dateDiv = document.createElement('div')
    dateDiv.className = 'first_coll'
    dateDiv.innerHTML = item.date
    row1.appendChild(dateDiv)

    const accountDiv = document.createElement('div')
    accountDiv.className = 'second_coll small'
    accountDiv.innerHTML = item.account
    accountDiv.addEventListener('click', this.onAccountClickedProxy)
    row1.appendChild(accountDiv)

    const amountDiv = document.createElement('div')
    amountDiv.className = 'third_coll number'
    amountDiv.innerHTML = asafonov.utils.displayMoney(Math.abs(item.amount))
    amountDiv.setAttribute('contenteditable', 'true')
    amountDiv.addEventListener('focus', event => event.currentTarget.setAttribute('data-content', event.currentTarget.innerText.replace(/\n/g, '')))
    amountDiv.addEventListener('blur', this.onAmountChangedProxy)
    row1.appendChild(amountDiv)
    itemDiv.appendChild(row1)

    const row2 = document.createElement('div')
    row2.className = 'row'

    const posDiv = document.createElement('div')
    posDiv.className = 'first_coll small'
    posDiv.innerHTML = item.pos
    posDiv.setAttribute('data-name', 'pos')
    posDiv.setAttribute('contenteditable', 'true')
    posDiv.addEventListener('focus', event => event.currentTarget.setAttribute('data-content', event.currentTarget.innerText.replace(/\n/g, '')))
    posDiv.addEventListener('blur', this.onItemDataChangedProxy)
    row2.appendChild(posDiv)

    const tagDiv = document.createElement('div')
    tagDiv.className = 'second_coll small'
    tagDiv.innerHTML = item.tag
    tagDiv.addEventListener('click', this.onTagClickedProxy)
    row2.appendChild(tagDiv)

    const icoDiv = document.createElement('div')
    icoDiv.className = 'third_coll ico_container'
    row2.appendChild(icoDiv)
    const ico = document.createElement('div')
    ico.classList.add('trans_' + item.type)
    ico.classList.add('svg')
    icoDiv.appendChild(ico)
    itemDiv.appendChild(row2)

    if (! itemAdded && !! this.addButton) this.addButton.after(itemDiv)
  }

  updateList() {
    this.clearExistingItems()
    this.updateTotal()
    const list = this.model.getList()

    for (let i = 0; i < list.length; ++i) {
      this.renderItem(list[i], i)
    }
  }

  destroy() {
    this.removeEventListeners()
    this.model.destroy()
    this.addButton = null
    this.listElement = null
    this.incomeElement = null
    this.expenseElement = null
    this.reviewElement = null
  }
}

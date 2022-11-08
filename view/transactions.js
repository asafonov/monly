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

    this.headerElement = this.listElement.querySelector('h1').parentNode
    this.addButton = this.listElement.querySelector('.add_link')
    this.incomeElement = document.querySelector('.income')
    this.expenseElement = document.querySelector('.expense')
    this.onAddButtonClickedProxy = this.onAddButtonClicked.bind(this)
    this.onAmountChangedProxy = this.onAmountChanged.bind(this)
    this.onItemDataChangedProxy = this.onItemDataChanged.bind(this)
    this.onValueChangeProxy = this.onValueChange.bind(this)
    this.addEventListeners()
    this.accounts = Object.keys(asafonov.accounts.getList())
    this.categories = asafonov.settings.getItem('categories')
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

  onValueChange (event) {
    const value = event.currentTarget.value || event.currentTarget.innerText
    const name = event.currentTarget.getAttribute('data-name')
    let el = event.currentTarget
    let id

    while (!id) {
      el = el.parentNode
      id = el.getAttribute('data-id')
    }

    const data = this.model.getItem(id)

    if (data[name] !== value) {
      const newData = {}
      newData[name] = value
      this.model.updateItem(id, newData)
    }

    return value
  }

  renderItem (item, i) {
    const itemId = this.genItemId(i)
    let itemDiv = this.listElement.querySelector(`#${itemId}`)
    let itemAdded = true

    if (! itemDiv) {
      itemDiv = document.createElement('div')
      itemDiv.className = 'section_row transaction item'
      itemDiv.setAttribute('data-id', i)
      itemDiv.id = itemId
      itemAdded = false
    }

    itemDiv.innerHTML = ''

    const col1 = document.createElement('div')
    col1.className = 'transaction_coll'

    const dateEl = document.createElement('input')
    dateEl.value = item.date
    dateEl.setAttribute('type', 'date')
    dateEl.setAttribute('data-name', 'date')
    dateEl.addEventListener('change', this.onValueChangeProxy)
    col1.appendChild(dateEl)

    const posDiv = document.createElement('div')
    const posInput = document.createElement('input')
    posInput.value = item.pos
    posInput.setAttribute('data-name', 'pos')
    posInput.addEventListener('change', this.onValueChangeProxy)
    posDiv.appendChild(posInput)
    col1.appendChild(posDiv)
    itemDiv.appendChild(col1)
    const col2 = document.createElement('div')
    col2.className = 'transaction_coll'
    const accountEl = document.createElement('select')

    for (let i = 0; i < this.accounts.length; ++i) {
      const opt = document.createElement('option')
      opt.value = this.accounts[i]
      opt.text = this.accounts[i]
      this.accounts[i] === item.account && (opt.setAttribute('selected', true))
      accountEl.appendChild(opt)
    }

    accountEl.setAttribute('data-name', 'account')
    accountEl.addEventListener('change', this.onValueChangeProxy)
    col2.appendChild(accountEl)
    const categoryEl = document.createElement('select')

    for (let i = 0; i < this.categories.length; ++i) {
      const opt = document.createElement('option')
      opt.value = this.categories[i]
      opt.text = this.categories[i]
      this.categories[i] === item.tag && (opt.setAttribute('selected', true))
      categoryEl.appendChild(opt)
    }

    categoryEl.setAttribute('data-name', 'tag')
    categoryEl.addEventListener('change', this.onValueChangeProxy)
    col2.appendChild(categoryEl)
    itemDiv.appendChild(col2)
    const col3 = document.createElement('div')
    col3.className = 'transaction_coll'
    const amountEl = document.createElement('p')
    amountEl.className = 'number'
    amountEl.setAttribute('contenteditable', true)
    amountEl.setAttribute('data-name', 'amount')
    amountEl.innerHTML = asafonov.utils.displayMoney(item.amount)
    amountEl.addEventListener('focus', event => event.currentTarget.setAttribute('data-content', event.currentTarget.innerText.replace(/\n/g, '')))
    amountEl.addEventListener('blur', this.onValueChangeProxy)
    col3.appendChild(amountEl)
    itemDiv.appendChild(col3)

    if (! itemAdded && !! this.headerElement) this.headerElement.after(itemDiv)
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

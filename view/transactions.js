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
    this.onValueChangeProxy = this.onValueChange.bind(this)
    this.addEventListeners()
    this.updateAccounts()
    this.updateCateories()
  }

  updateAccounts() {
    this.accounts = Object.keys(asafonov.accounts.getList())
  }

  updateCateories() {
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
      '',
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
    const newData = {}

    if (name === 'dc') {
      newData.amount = value * Math.abs(data.amount / 100)
    } else if (data[name] !== value) {
      newData[name] = name === 'amount' ? Math.abs(value) : value
    }

    this.model.updateItem(id, newData)
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

    const dcDiv = document.createElement('div')
    const dcSelect = document.createElement('select')

    for (let i of ['expense', 'income']) {
      const opt = document.createElement('option')
      opt.value = i === 'expense' ? 1 : -1
      opt.text = i
      i === item.type && opt.setAttribute('selected', true)
      dcSelect.appendChild(opt)
    }

    dcSelect.setAttribute('data-name', 'dc')
    dcSelect.setAttribute('size', '1')
    dcSelect.addEventListener('change', this.onValueChangeProxy)
    dcDiv.appendChild(dcSelect)
    col1.appendChild(dcDiv)
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
    amountEl.innerHTML = asafonov.utils.displayMoney(Math.abs(item.amount))
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

class BudgetsView {

  constructor() {
    this.listElement = document.querySelector('.budgets')
    const settings = asafonov.settings
    const mainscreen = settings.getItem('mainscreen')
    const isEnabled = mainscreen.budget
    this.model = new Budgets()

    if (! isEnabled) {
      this.listElement.parentNode.removeChild(this.listElement)
      return
    }

    this.transactions = null
    this.onAddButtonClickedProxy = this.onAddButtonClicked.bind(this)
    this.onTitleChangedProxy = this.onTitleChanged.bind(this)
    this.onValueChangedProxy = this.onValueChanged.bind(this)
    this.addButton = this.listElement.querySelector('.add_link')
    this.totalElement = this.listElement.querySelector('.total')
    this.addEventListeners()
    this.updateCateories()
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
    asafonov.messageBus[add ? 'subscribe' : 'unsubscribe'](asafonov.events.BUDGET_UPDATED, this, 'onBudgetUpdated')
    asafonov.messageBus[add ? 'subscribe' : 'unsubscribe'](asafonov.events.BUDGET_RENAMED, this, 'onBudgetRenamed')
    asafonov.messageBus[add ? 'subscribe' : 'unsubscribe'](asafonov.events.TRANSACTIONS_LOADED, this, 'onTransactionsLoaded')
    asafonov.messageBus[add ? 'subscribe' : 'unsubscribe'](asafonov.events.TRANSACTION_UPDATED, this, 'onTransactionUpdated')
  }

  onAddButtonClicked() {
    const name = 'Groceries'
    this.model.updateItem(name, 0)
  }

  onBudgetUpdated (event) {
    this.renderItem(event.id, event.to)
    this.updateBudgetCompletion(event.id)
    this.updateTotal()
  }

  onBudgetRenamed (event) {
    const oldId = this.genItemId(event.from)
    const newId = this.genItemId(event.to)
    document.querySelector(`#${oldId}`).id = newId
    this.renderItem(event.to, event.item)
    this.updateBudgetCompletion(event.to)
  }

  onTransactionsLoaded (event) {
    if (this.transactions !== null && this.transactions !== undefined) return

    const list = this.model.getList()
    this.transactions = event.list
    this.updateTotal()

    for (let tag in list) {
      this.updateBudgetCompletion(tag)
    }
  }

  onTransactionUpdated (event) {
    let affectedTags = [event.to.tag]
    event.from && event.from.tag !== event.to.tag && (affectedTags.push(event.from.tag))

    for (let i = 0; i < affectedTags.length; ++i) {
      if (this.model.getItem(affectedTags[i]) !== undefined) {
        this.updateBudgetCompletion(affectedTags[i])
        this.updateTotal()
      }
    }
  }

  updateBudgetCompletion (tag) {
    const sum = this.transactions.sumByTag(tag)
    const itemId = this.genItemId(tag)
    const item = this.listElement.querySelector(`#${itemId}`)
    const budget = asafonov.utils.displayMoney(this.model.getItem(tag))
    const left = asafonov.utils.displayMoney(this.model.getItem(tag) - sum)
    const spent = asafonov.utils.displayMoney(sum)

    item.querySelector(`.number.left`).innerHTML = left
    item.querySelectorAll('.budget_row .number span')[0].innerText = `${spent} / `
    item.querySelectorAll('.budget_row .number span')[1].innerText = budget

    const width = Math.min(100, parseInt(sum / this.model.getItem(tag) * 100))
    item.querySelector('.budget_fill').style.width = `${width}%`
  }

  clearExistingItems() {
    const items = this.listElement.querySelectorAll('.item')

    for (let i = 0; i < items.length; ++i) {
      this.listElement.removeChild(items[i])
    }
  }

  genItemId (name) {
    return `budget_${name}`
  }

  renderItem (name, amount) {
    let itemExists = true
    const itemId = this.genItemId(name)
    let item = this.listElement.querySelector(`#${itemId}`)

    if (! item) {
      item = document.createElement('div')
      itemExists = false
      item.id = itemId
      item.className = 'item'
    }

    item.innerHTML = ''
    const displayAmount = asafonov.utils.displayMoney(amount)
    const displayZero = asafonov.utils.displayMoney(0)

    const row1 = document.createElement('div')
    row1.className = 'section_row'
    const nameEl = document.createElement('select')

    for (let i = 0; i < this.categories.length; ++i) {
      const opt = document.createElement('option')
      opt.value = this.categories[i]
      opt.text = this.categories[i]
      this.categories[i] === name && (opt.setAttribute('selected', true))
      nameEl.appendChild(opt)
    }

    nameEl.className = 'budget_name'
    nameEl.addEventListener('change', this.onTitleChangedProxy)
    nameEl.addEventListener('focus', event => event.currentTarget.setAttribute('data-value', event.currentTarget.value))
    row1.appendChild(nameEl)
    const amountEl = document.createElement('p')
    amountEl.className = 'number left'
    amountEl.innerHTML = displayZero
    row1.appendChild(amountEl)
    item.appendChild(row1)

    const row2 = document.createElement('div')
    row2.className = 'budget_row'
    const numberEl = document.createElement('p')
    numberEl.className = 'number'
    const span1 = document.createElement('span')
    span1.innerHTML = displayZero + ' / '
    numberEl.appendChild(span1)
    const span2 = document.createElement('span')
    span2.innerHTML = displayAmount
    span2.addEventListener('blur', this.onValueChangedProxy)
    span2.setAttribute('contenteditable', true)
    numberEl.appendChild(span2)
    row2.appendChild(numberEl)
    const budgetLine = document.createElement('div')
    budgetLine.className = 'budget_line'
    const budgetFill = document.createElement('div')
    budgetFill.className = 'budget_fill'
    budgetLine.appendChild(budgetFill)
    row2.appendChild(budgetLine)
    item.appendChild(row2)

    if (! itemExists) {
      this.listElement.insertBefore(item, this.addButton)
    }
  }

  onTitleChanged (event) {
    const newValue = event.currentTarget.value
    const originalValue = event.currentTarget.getAttribute('data-value')

    if (newValue !== originalValue) {
      if (newValue.length > 0) {
        this.model.updateId(originalValue, newValue)
      } else {
        this.model.deleteItem(originalValue)
        this.updateList()
      }
    }
  }

  onValueChanged (event) {
    const value = event.currentTarget
    const title = value.parentNode.parentNode.parentNode.querySelector('.budget_name').value
    const newValue = value.innerText.replace(/\n/g, '')
    this.model.updateItem(title, newValue)
  }

  updateList() {
    this.clearExistingItems()
    const list = this.model.getList()

    for (let key in list) {
      this.renderItem(key, list[key])
    }
  }

  updateTotal() {
    const list = this.model.getList()
    let total = 0

    for (let key in list) {
      total += list[key] - this.transactions.sumByTag(key)
    }

    this.totalElement.innerHTML = asafonov.utils.displayMoney(total)
  }

  destroy() {
    this.removeEventListeners()
    this.model.destroy()
    this.addButton = null
    this.listElement = null
    this.totalElement = null
  }
}

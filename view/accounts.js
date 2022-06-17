class AccountsView {
  constructor() {
    this.listElement = document.querySelector('.accounts')
    this.settings = new Settings()
    const mainscreen = this.settings.getItem('mainscreen')
    const isEnabled = mainscreen.accounts
    this.model = asafonov.accounts

    if (! isEnabled) {
      this.listElement.parentNode.removeChild(this.listElement)
      return
    }

    this.onAddButtonClickedProxy = this.onAddButtonClicked.bind(this)
    this.onAccountTitleChangedProxy = this.onAccountTitleChanged.bind(this)
    this.onAccountValueChangedProxy = this.onAccountValueChanged.bind(this)
    this.addButton = this.listElement.querySelector('.add')
    this.addEventListeners()
  }

  addEventListeners() {
    this.updateEventListeners(true)
    asafonov.messageBus.subscribe(asafonov.events.ACCOUNT_UPDATED, this, 'onAccountUpdated')
    asafonov.messageBus.subscribe(asafonov.events.ACCOUNT_RENAMED, this, 'onAccountRenamed')
  }

  removeEventListeners() {
    this.updateEventListeners()
    asafonov.messageBus.unsubscribe(asafonov.events.ACCOUNT_UPDATED, this, 'onAccountUpdated')
    asafonov.messageBus.unsubscribe(asafonov.events.ACCOUNT_RENAMED, this, 'onAccountRenamed')
  }

  updateEventListeners (add) {
    this.addButton[add ? 'addEventListener' : 'removeEventListener']('click', this.onAddButtonClickedProxy)
  }

  onAddButtonClicked() {
    const accountName = 'Account' + Math.floor(Math.random() * 1000)
    this.model.updateItem(accountName, 0)
  }

  onAccountUpdated (event) {
    this.renderItem(event.id, event.to)
    this.updateTotal()
  }

  onAccountRenamed (event) {
    const oldId = this.genItemId(event.from)
    const newId = this.genItemId(event.to)
    document.querySelector(`#${oldId}`).id = newId
    this.renderItem(event.to, event.item)
  }

  clearExistingItems() {
    const items = this.listElement.querySelectorAll('.item')

    for (let i = 0; i < items.length; ++i) {
      this.listElement.removeChild(items[i])
    }
  }

  genItemId (name) {
    return `item_${name}`
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
    const title = document.createElement('div')
    title.className = 'title'
    title.setAttribute('contenteditable', 'true')
    title.innerHTML = name
    title.addEventListener('focus', event => event.currentTarget.setAttribute('data-content', event.currentTarget.innerText.replace(/\n/g, '')))
    title.addEventListener('blur', this.onAccountTitleChangedProxy)
    item.appendChild(title)
    const value = document.createElement('div')
    value.className = 'number'
    value.innerHTML = asafonov.utils.displayMoney(amount)
    value.setAttribute('contenteditable', 'true')
    value.addEventListener('focus', event => event.currentTarget.setAttribute('data-content', event.currentTarget.innerText.replace(/\n/g, '')))
    value.addEventListener('blur', this.onAccountValueChangedProxy)
    item.appendChild(value)

    if (! itemExists) {
      this.listElement.insertBefore(item, this.addButton)
    }
  }

  onAccountTitleChanged (event) {
    const title = event.currentTarget
    const newValue = title.innerText.replace(/\n/g, '')
    const originalValue = title.getAttribute('data-content')

    if (newValue !== originalValue) {
      if (newValue.length > 0) {
        this.model.updateId(originalValue, newValue)
      } else {
        this.model.deleteItem(originalValue)
        this.updateList()
      }
    }
  }

  onAccountValueChanged (event) {
    const value = event.currentTarget
    const title = value.parentNode.querySelector('.title')
    const newValue = value.innerText.replace(/\n/g, '')
    const originalValue = value.getAttribute('data-content')

    if (newValue !== originalValue) {
      const amount = Math.round(parseFloat(newValue) * 100)
      this.model.updateItem(title.innerHTML, amount)
    }
  }

  updateList() {
    this.clearExistingItems()
    const list = this.model.getList()
    this.updateTotal()

    for (let key in list) {
      this.renderItem(key, list[key])
    }
  }

  updateTotal() {
    const list = this.model.getList()
    const totalElement = this.listElement.querySelector('.number.big')
    let total = 0
    const accountRate = this.settings.getItem('account_rate')

    for (let key in list) {
      total += list[key] * (accountRate[key] || 1)
    }

    totalElement.innerHTML = asafonov.utils.displayMoney(total)
  }

  destroy() {
    this.removeEventListeners()
    this.model.destroy()
    this.addButton = null
    this.listElement = null
  }
}

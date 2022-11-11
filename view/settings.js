class SettingsView {

  constructor() {
    this.model = asafonov.settings
    this.mainScreen = document.querySelector('.settings-mainscreen')
    this.defaultAccountScreen = document.querySelector('.settings-default-account')
    this.accountRateScreen = document.querySelector('.settings-account-rate')
    this.categoriesScreen = document.querySelector('.settings-categories')
  }

  _createUnderline() {
    const underline = document.createElement('div')
    underline.className = 'underline'
    return underline
  }

  _createCheckbox (title, checked, isFirst, onchange) {
    const label = document.createElement('label')
    label.className = `section_row${isFirst ? ' no_number' : ''}`
    const p = document.createElement('p')
    p.innerHTML = title
    label.appendChild(p)
    const checkbox = document.createElement('input')
    checkbox.setAttribute('type', 'checkbox')
    checked && checkbox.setAttribute('checked', true)
    checkbox.addEventListener('change', onchange)
    label.appendChild(checkbox)
    return label
  }

  showMainScreen() {
    this.mainScreen.innerHTML = '<h1>main screen</h1>'
    const items = this.model.getItem('mainscreen')
    let isFirst = true

    for (let i in items) {
      if (! isFirst) {
        this.mainScreen.appendChild(this._createUnderline())
      }

      this.mainScreen.appendChild(this._createCheckbox(i, items[i], isFirst, () => {
        items[i] = ! items[i]
        this.model.updateItem('mainscreen', items)
      }))
      isFirst = false
    }
  }

  showDefaultAccountScreen() {
    this.defaultAccountScreen.innerHTML = '<h1>default account</h1>'
    const accounts = asafonov.accounts.getList()
    const defaultAccount = this.model.getItem('default_account')
    let isFirst = true

    for (let i in accounts) {
      if (! isFirst) {
        this.defaultAccountScreen.appendChild(this._createUnderline())
      }

      this.defaultAccountScreen.appendChild(this._createCheckbox(i, i === defaultAccount, isFirst, event => {
        const items = this.defaultAccountScreen.querySelectorAll('input[type=checkbox]')

        for (let i of items) {
          i.removeAttribute('checked')
        }

        event.target.setAttribute('checked', true)
        this.model.updateItem('default_account', i)
      }))
      isFirst = false
    }
  }

  showAccountRateScreen() {
    this.accountRateScreen.innerHTML = '<h1>account rates</h1>'
    const accounts = asafonov.accounts.getList()
    const currency = new Currency()

    for (let i in accounts) {
      const div = document.createElement('div')
      div.className = 'item accounts-item'
      div.innerHTML = `<div>${i}</div>`
      this.accountRateScreen.appendChild(div)
      div.addEventListener('click', async event => {
        const accountRate = this.model.getItem('account_rate') || {}
        const isRateNeeded = currency.isRateNeeded(accountRate[i])
        const newRate = prompt('Please enter the account rate', (accountRate[i] || await currency.initRate(accountRate[i])) + (isRateNeeded ? ` (${await currency.initRate(accountRate[i])})` : ''))

        if (newRate) {
          accountRate[i] = currency.trim(newRate)
          this.model.updateItem('account_rate', accountRate)
        }
      })
    }
  }

  showCategoriesScreen() {
    this.categoriesScreen.innerHTML = '<h1>categories</h1>'
    const items = this.model.getItem('categories')

    for (let i of items) {
      const div = document.createElement('div')
      div.className = 'item'
      div.innerHTML = `<div>${i}</div>`
      this.categoriesScreen.appendChild(div)
      div.addEventListener('click', () => {
        if (confirm(`Delete category "${i}"?`)) {
          items.splice(items.indexOf(i), 1)
          this.model.updateItem('categories', items)
          this.showCategoriesScreen()
        }
      })
    }

    const addButton = document.createElement('div')
    addButton.className = 'add'
    addButton.innerHTML = 'add category'
    this.categoriesScreen.appendChild(addButton)
    addButton.addEventListener('click', () => {
      const category = prompt('Enter the category name:')

      if (category) {
        items.push(category)
        this.model.updateItem('categories', items)
        this.showCategoriesScreen()
      }
    })
  }

  show() {
    this.showMainScreen()
    this.showDefaultAccountScreen()
    this.showAccountRateScreen()
    this.showCategoriesScreen()
  }

}

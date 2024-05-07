class SettingsView {

  constructor() {
    this.model = asafonov.settings
    this.themeView = new ThemeView()
    this.mainScreen = document.querySelector('.settings-mainscreen')
    this.defaultAccountScreen = document.querySelector('.settings-default-account')
    this.defaultCurrencyScreen = document.querySelector('.settings-default-currency')
    this.accountRateScreen = document.querySelector('.settings-account-rate')
    this.categoriesScreen = document.querySelector('.settings-categories')
    this.themeScreen = document.querySelector('.settings-theme')
    this.additionalSettingsScreen = document.querySelector('.settings-additional')
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

  _createLine (title, isFirst, onclick) {
    const div = document.createElement('label')
    div.className = `section_row${isFirst ? ' no_number' : ''}`
    const p = document.createElement('p')
    p.innerHTML = title
    div.appendChild(p)
    div.addEventListener('click', onclick)
    return div
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
          i.checked = false
        }

        event.currentTarget.checked = true
        this.model.updateItem('default_account', i)
      }))
      isFirst = false
    }
  }

  showDefaultCurrencyScreen() {
    const currency = new Currency()
    this.defaultCurrencyScreen.innerHTML = '<h1>default currency</h1>'
    this.defaultCurrencyScreen.appendChild(
      this._createLine(this.model.getItem('default_currency'), true, event => {
        const c = this.model.getItem('default_currency')
        let nc = prompt('Please enter new default currency', c)

        if (nc) {
          nc = currency.trim(nc)
          this.model.updateItem('default_currency', nc)
          event.currentTarget.querySelector('p').innerHTML = nc

          if (nc !== c) currency.getRates(nc)
        }
      })
    )
  }

  showAccountRateScreen() {
    const currency = new Currency()
    this.accountRateScreen.innerHTML = '<h1>account currencies</h1>'
    const accounts = asafonov.accounts.getList()
    let isFirst = true
    const accountRate = this.model.getItem('account_rate') || {}

    for (let i in accounts) {
      if (! isFirst) {
        this.accountRateScreen.appendChild(this._createUnderline())
      }

      this.accountRateScreen.appendChild(this._createLine(i, isFirst, async event => {
        const rate = accountRate[i] || this.model.getItem('default_currency')
        const isRateNeeded = currency.isRateNeeded(accountRate[i])
        const newRate = prompt('Please enter the account currency', (rate || await currency.initRate(rate)) + (isRateNeeded ? ` (${await currency.initRate(rate)})` : ''))

        if (newRate) {
          accountRate[i] = currency.trim(newRate)
          this.model.updateItem('account_rate', accountRate)
        }
      }))
      isFirst = false
    }
  }

  showCategoriesScreen() {
    this.categoriesScreen.innerHTML = '<h1>categories</h1>'
    const items = this.model.getItem('categories')

    let isFirst = true

    for (let i of items) {
      this.categoriesScreen.appendChild(this._createLine(i, isFirst, async event => {
        if (confirm(`Delete category "${i}"?`)) {
          items.splice(items.indexOf(i), 1)
          this.model.updateItem('categories', items)
          this.showCategoriesScreen()
        }
      }))
      isFirst = false
      this.categoriesScreen.appendChild(this._createUnderline())
    }

    const addButton = document.createElement('a')
    addButton.className = 'add_link'
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

  showThemeScreen() {
    const themes = ['light', 'dark']
    this.themeScreen.innerHTML = '<h1>theme</h1>'
    const theme = this.model.getItem('theme')
    let isFirst = true

    for (let i of themes) {
      if (! isFirst) {
        this.themeScreen.appendChild(this._createUnderline())
      }

      this.themeScreen.appendChild(this._createCheckbox(i, i === theme, isFirst, event => {
        const items = this.themeScreen.querySelectorAll('input[type=checkbox]')

        for (let c of items) {
          c.checked = false
        }

        event.currentTarget.checked = true
        this.model.updateItem('theme', i)
        this.themeView.apply(i)
      }))
      isFirst = false
    }
  }

  showAdditionalSettingsScreen() {
    this.additionalSettingsScreen.innerHTML = '<h1>additional settings</h1>'
    let showUpdateDialog = this.model.getItem('show_update_dialog')
    this.additionalSettingsScreen.appendChild(this._createCheckbox('update within the app', showUpdateDialog, true, event => {
      showUpdateDialog = ! showUpdateDialog
      this.model.updateItem('show_update_dialog', showUpdateDialog)
      event.currentTarget.checked = showUpdateDialog
    }))
  }

  show() {
    this.showMainScreen()
    this.showDefaultAccountScreen()
    this.showDefaultCurrencyScreen()
    this.showAccountRateScreen()
    this.showCategoriesScreen()
    this.showThemeScreen()
    this.showAdditionalSettingsScreen()
  }

}

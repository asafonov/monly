class SettingsView {

  constructor() {
    this.model = asafonov.settings
    this.mainScreen = document.querySelector('.settings-mainscreen')
    this.defaultAccountScreen = document.querySelector('.settings-default-account')
    this.accountRateScreen = document.querySelector('.settings-account-rate')
  }

  showMainScreen() {
    this.mainScreen.innerHTML = '<h1>main screen</h1>'
    const items = this.model.getItem('mainscreen')

    for (let i in items) {
      const div = document.createElement('div')
      div.className = 'item'
      div.innerHTML = `<div>${i}</div>`
      div.setAttribute('data-value', i)
      items[i] && div.classList.add('set')
      this.mainScreen.appendChild(div)
      div.addEventListener('click', event => {
        const target = event.target.parentNode
        const value = target.getAttribute('data-value')
        items[value] = ! items[value]

        if (items[value]) {
          target.classList.add('set')
        } else {
          target.classList.remove('set')
        }

        this.model.updateItem('mainscreen', items)
      })
    }
  }

  showDefaultAccountScreen() {
    this.defaultAccountScreen.innerHTML = '<h1>default account</h1>'
    const accounts = asafonov.accounts.getList()
    const defaultAccount = this.model.getItem('default_account')

    for (let i in accounts) {
      const div = document.createElement('div')
      div.className = 'item accounts-item'
      div.innerHTML = `<div>${i}</div>`
      div.setAttribute('data-value', i)
      defaultAccount === i && div.classList.add('set')
      this.defaultAccountScreen.appendChild(div)
      div.addEventListener('click', event => {
        const target = event.target.parentNode
        const value = target.getAttribute('data-value')
        const items = document.querySelectorAll('.accounts-item')

        for (let i = 0; i < items.length; ++i) {
          items[i].classList.remove('set')
        }

        target.classList.add('set')
        this.model.updateItem('default_account', value)
      })
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
        const newRate = prompt('Please enter the account rate', (accountRate[i] || 1) + (isRateNeeded ? ` (${await currency.initRate(accountRate[i])})` : ''))

        if (newRate) {
          accountRate[i] = currency.trim(newRate)
          this.model.updateItem('account_rate', accountRate)
        }
      })
    }
  }

  show() {
    this.showMainScreen()
    this.showDefaultAccountScreen()
    this.showAccountRateScreen()
  }

}

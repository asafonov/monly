class SettingsView {

  constructor() {
    this.model = new Settings()
    this.mainScreen = document.querySelector('.settings-mainscreen')
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

  show() {
    this.showMainScreen()
  }

}

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
      items[i] && div.classList.add('set')
      this.mainScreen.appendChild(div)
    }
  }

  show() {
    this.showMainScreen()
  }

}

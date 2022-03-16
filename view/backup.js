class BackupView {

  constructor() {
    this.model = new Backup()
    this.mainContainer = document.querySelector('.settings-backup')
    this.clearButton = this.mainContainer.querySelector('.clear')
    this.onClearButtonClickedProxy = this.onClearButtonClicked.bind(this)
    this.addEventListeners()
  }

  addEventListeners() {
    this.updateEventListeners(true)
  }

  removeEventListeners() {
    this.updateEventListeners()
  }

  updateEventListeners (add) {
    this.clearButton[add ? 'addEventListener' : 'removeEventListener']('click', this.onClearButtonClickedProxy)
  }

  onClearButtonClicked() {
    if (confirm('Are you sure you want to clear App data? This can\'t be undone')) {
      this.model.clear()
      location.reload()
    }
  }

  destroy() {
    this.removeEventListeners()
    this.model.destroy()
    this.clearButton = null
    this.mainContainer = null
  }
}

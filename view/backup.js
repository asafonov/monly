class BackupView {

  constructor() {
    this.model = new Backup()
    this.mainContainer = document.querySelector('.settings-backup')
    this.clearButton = this.mainContainer.querySelector('.clear')
    this.backupButton = this.mainContainer.querySelector('.backup')
    this.onClearButtonClickedProxy = this.onClearButtonClicked.bind(this)
    this.onBackupButtonClickedProxy = this.onBackupButtonClicked.bind(this)
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
    this.backupButton[add ? 'addEventListener' : 'removeEventListener']('click', this.onBackupButtonClickedProxy)
  }

  onClearButtonClicked() {
    if (confirm('Are you sure you want to clear App data? This can\'t be undone')) {
      this.model.clear()
      location.reload()
    }
  }

  onBackupButtonClicked() {
    const hostname = prompt('Hostname', window.localStorage.getItem('hostname') || '192.168.0.1')

    if (hostname) {
      window.localStorage.setItem('hostname', hostname)
      this.model.backup(hostname)
    }
  }

  destroy() {
    this.removeEventListeners()
    this.model.destroy()
    this.clearButton = null
    this.mainContainer = null
  }
}

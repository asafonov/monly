class ExportView {
  constructor() {
    this.controller = new ExportController();
    this.element = document.querySelector('.monly-export');
    this.element.href = this.controller.getDownloadUrl();
    this.element.setAttribute('download', this.getDownloadName());
  }

  getDownloadName() {
    return 'monly_backup.json';
  }

  destroy() {
    this.controller = null;
    this.element = null;
  }

}

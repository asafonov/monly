class ThemeView {

  constructor() {
    const theme = asafonov.settings.getItem('theme')
    this.apply(theme)
  }

  apply (theme) {
    document.querySelector('body').className = `${theme}_theme`
  }

}

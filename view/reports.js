class ReportsView {

  constructor() {
    this.model = new Reports()
    this.controller = new ReportsController()
    this.circleLen = 30 * 0.42 * 2 * Math.PI
    this.popup = document.querySelector('.select')
    this.options = this.popup.querySelector('.options')
    this.active = this.popup.querySelector('.active')
    this.togglePopupProxy = this.togglePopup.bind(this)
    this.addEventListeners()
    this.initAvailableReports()
  }

  initAvailableReports() {
    const availableReports = this.controller.availableReports()
    const availableReportsMap = {}

    for (let i = 0; i < availableReports.length; ++i) {
      availableReportsMap[availableReports[i]] = true
    }

    const year = new Date().getFullYear()
    this.options.querySelector('.year').innerHTML = year

    for (let i = 1; i < 13; ++i) {
      const m = asafonov.utils.padlen(i + '', 2, '0')
      const c = `.m${m}`
      const k = `${year}${m}`
      const isReportAvailable = availableReportsMap[k]
      const month = this.options.querySelector(c)
      month.style.display = isReportAvailable ? 'block' : 'none'

      if (isReportAvailable) {
        month.addEventListener('click', () => this.loadReport(m, year))
      }
    }
  }

  loadReport (m, y) {
    this.model.destroy()
    this.model = new Reports(y, m)
    this.show()
    this.togglePopup()
    this.active.innerHTML = this.options.querySelector(`.m${m}`).innerHTML + ' ' + y
  }

  addEventListeners() {
    this.active.addEventListener('click', this.togglePopupProxy)
  }

  removeEventListeners() {
    this.active.removeEventListener('click', this.togglePopupProxy)
  }

  togglePopup() {
    this.popup.classList.toggle('monly-popup')
  }

  clearExistingItems() {
    const items = this.element.querySelectorAll('.item')

    for (let i = 0; i < items.length; ++i) {
      this.element.removeChild(items[i])
    }
  }

  showExpenses() {
    this.element = document.querySelector('.expenses.monly-circle')
    this.circleElement = this.element.querySelector('.donut.chart svg')
    this.totalElement = this.element.querySelector('.number.big')
    this.donutElement = this.element.querySelector('.donut.chart')
    this.showChart(i => i > 0)
  }

  showIncome() {
    this.element = document.querySelector('.income.monly-circle')
    this.circleElement = this.element.querySelector('.donut.chart svg')
    this.totalElement = this.element.querySelector('.number.big')
    this.donutElement = this.element.querySelector('.donut.chart')
    this.showChart(i => i < 0)
  }

  show() {
    this.showExpenses()
    this.showIncome()
  }

  showChart (proceedFunction) {
    this.circleElement.innerHTML = ''
    this.clearExistingItems()

    this.model.build()
    const data = this.model.getItem(0)
    const subtotal = Object.values(data).filter(proceedFunction).reduce((accumulator, currentValue) => accumulator + currentValue, 0)
    const total = Math.abs(subtotal)
    let i = 1
    let offset = 0
    this.totalElement.innerHTML = asafonov.utils.displayMoney(total)

    for (let item in data) {
      if (! proceedFunction(data[item])) continue

      const value = Math.abs(data[item])
      const lineLen = value / total * this.circleLen
      const spaceLen = this.circleLen - lineLen
      const circle = document.createElement('circle')
      circle.className = `slice_${i}`
      circle.style.strokeDasharray = `${lineLen} ${spaceLen}`
      circle.style.strokeDashoffset = offset
      this.circleElement.innerHTML += circle.outerHTML

      const itemDiv = document.createElement('div')
      itemDiv.className = 'item'
      itemDiv.innerHTML = `<div><span class="bullet slice_${i}"></span>${item}</div>`
      const displayMoney = asafonov.utils.displayMoney(value)
      itemDiv.innerHTML += `<div class="number">${displayMoney}</div>`
      this.donutElement.after(itemDiv)

      offset -= lineLen
      ++i
    }

    const circle = document.createElement('circle')
    circle.className = 'slice_f'
    this.circleElement.innerHTML += circle.outerHTML
  }

  destroy() {
    this.model.destroy()
    this.controller.destroy()
    this.removeEventListeners()
  }
}

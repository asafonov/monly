class ReportsView {

  constructor() {
    alert('init!!!')
    this.model = new Reports()
    this.controller = new ReportsController()
    this.circleLen = 125.5
    this.circleDeg = 360
    this.initAvailableReports()
  }

  initAvailableReports() {
    const availableReports = this.controller.availableReports()
    return
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

  clearExistingItems() {
    this.legendElement.innerHTML = ''
  }

  showExpenses() {
    this.element = document.querySelector('.monly-expenses')
    this.donutElement = this.element.querySelector('.chart_donut')
    this.legendElement = this.element.querySelector('.chart_legend')
    this.showChart(i => i > 0)
  }

  showIncome() {
    this.element = document.querySelector('.income.monly-circle')
    this.donutElement = this.element.querySelector('.donut.chart')
    this.showChart(i => i < 0)
  }

  show() {
    this.showExpenses()
    //this.showIncome()
  }

  showChart (proceedFunction) {
    alert('show Chart!!!')
    this.donutElement.innerHTML = ''
    this.clearExistingItems()

    this.model.build()
    const data = this.model.getItem(0)
    const subtotal = Object.values(data).filter(proceedFunction).reduce((accumulator, currentValue) => accumulator + currentValue, 0)
    const total = Math.abs(subtotal)
    let degOffset = -90
    let lengthOffset = -this.circleLen
    const keys = Object.keys(data)
    keys.sort((a, b) => Math.abs(data[a]) - Math.abs(data[b]))

    for (let item of keys) {
      if (! proceedFunction(data[item])) continue

      const value = Math.abs(data[item])
      const lineLen = value / total * this.circleLen
      const deg = value / total * this.circleDeg
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      svg.setAttribute('viewBox', '0 0 100 100')
      svg.setAttribute('style', `transform: rotate(${degOffset}deg)`)
      const circle = document.createElement('circle')
      circle.style.strokeDashoffset = lengthOffset
      degOffset += deg
      lengthOffset += lineLen
      svg.appendChild(circle)
      this.donutElement.appendChild(svg)
      alert(this.donutElement.innerHTML)

      /*const itemDiv = document.createElement('div')
      itemDiv.className = 'item'
      itemDiv.innerHTML = `<div><span class="bullet slice_${i}"></span>${item}</div>`
      const displayMoney = asafonov.utils.displayMoney(value)
      itemDiv.innerHTML += `<div class="number">${displayMoney}</div>`
      this.donutElement.after(itemDiv)*/
    }

    this.donutElement.innerHTML += `<h2>${asafonov.utils.displayMoney(total)}</h2>`
  }

  destroy() {
    this.model.destroy()
    this.controller.destroy()
  }
}

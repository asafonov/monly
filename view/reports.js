class ReportsView {

  constructor() {
    this.model = new Reports()
    this.controller = new ReportsController()
    this.circleLen = 251
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
    this.element = document.querySelector('.monly-income')
    this.donutElement = this.element.querySelector('.chart_donut')
    this.legendElement = this.element.querySelector('.chart_legend')
    this.showChart(i => i < 0)
  }

  show() {
    this.showExpenses()
    this.showIncome()
  }

  showChart (proceedFunction) {
    this.donutElement.innerHTML = ''
    this.clearExistingItems()

    this.model.build()
    const data = this.model.getItem(0)

    if (! data) {
      this.donutElement.innerHTML += `<h2>No data</h2>`
      return
    }

    const subtotal = Object.values(data).filter(proceedFunction).reduce((accumulator, currentValue) => accumulator + currentValue, 0)
    const total = Math.abs(subtotal)
    let degOffset = -90
    let totalFraction = 0
    const keys = Object.keys(data)
    keys.sort((a, b) => Math.abs(data[a]) - Math.abs(data[b]))

    for (let i = 0; i < keys.length; ++i) {
      const item = keys[i]

      if (! proceedFunction(data[item])) continue

      const value = Math.abs(data[item])
      const fraction = value / total
      const lineLen = fraction * this.circleLen
      const deg = fraction * this.circleDeg
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      svg.setAttribute('viewBox', '0 0 100 100')
      svg.setAttribute('style', `transform: rotate(-90deg)`)
      const circle = document.createElement('circle')
      circle.setAttribute('stroke-dasharray', `${fraction * this.circleLen} ${this.circleLen - fraction * this.circleLen}`)
      circle.style.strokeDashoffset = `-${totalFraction * this.circleLen}`
      degOffset += deg
      totalFraction += fraction
      svg.appendChild(circle)
      this.donutElement.appendChild(svg)

      const itemDiv = document.createElement('div')
      const displayMoney = asafonov.utils.displayMoney(value)
      const underline = i < keys.length - 1 ? '<div class="underline"></div>' : ''
      itemDiv.className = 'legend_row'
      itemDiv.innerHTML = `<div class="section_row chart_row"><p class="dot">${item}</p><p class="number">${displayMoney}</p></div>${underline}`
      this.legendElement.appendChild(itemDiv)
    }

    this.donutElement.innerHTML += `<h2>${asafonov.utils.displayMoney(total)}</h2>`
  }

  destroy() {
    this.model.destroy()
    this.controller.destroy()
  }
}

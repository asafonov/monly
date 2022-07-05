class CurrencyController {

  buildUrl (base, symbol) {
    return `https://api.exchangerate.host/lates?base=${base}&symbols=${symbol}`
  }

  parseResponse (data, symbol) {
    return data.rates[symbol]
  }

  async convert (base, symbol) {
    const url = this.buildUrl(base, symbol)
    const response = await fetch(url)
    const data = await response.json()
    return this.parseResponse(data, symbol)
  }

}

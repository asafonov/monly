class Currency {

  buildUrl (base, symbol) {
    return `https://api.exchangerate.host/lates?base=${base}&symbols=${symbol}`
  }

  parseResponse (data, symbol) {
    return data.rates[symbol]
  }

  async convert (base, symbol) {
    const url = this.buildUrl(base, symbol)
    let ret = 1

    try {
      const response = await fetch(url)
      const data = await response.json()
      ret = this.parseResponse(data, symbol)
    } catch (e) {}

    return ret
  }

}

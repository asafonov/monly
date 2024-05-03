class Currency {

  buildUrl (base) {
    return `http://isengard.asafonov.org:8000/?base=${base}`
  }

  getFromCache (base, symbol) {
    const k = `currency_${base}`
    const cache = JSON.parse(window.localStorage.getItem(k)) || {}
    const t = cache.t || 0
    const now = new Date().getTime()

    if (t + 12 * 3600 * 1000 > now) {
      return cache.rates[symbol]
    }

    return null
  }

  async getRates (base) {
    const url = this.buildUrl(base)
    const response = await fetch(url)
    const data = await response.json()
    const k = `currency_${base}`
    const cache = {
      t: new Date().getTime(),
      rates: data
    }
    window.localStorage.setItem(k, JSON.stringify(cache))
  }

  async convert (base, symbol) {
    let ret = this.getFromCache(base, symbol)

    if (ret) return ret

    await this.getRates(base)
    return this.getFromCache(base, symbol) || 1
  }

  trim (value) {
    return this.isRateNeeded(value) ? value.substr(0, 6) : parseFloat(value)
  }

  isRateNeeded (rateValue) {
    return typeof rateValue === 'string' && rateValue.length >= 6 && rateValue.match(/[A-z]/g)
  }

  async initRate (rateValue) {
    if (this.isRateNeeded(rateValue)) {
      const base = rateValue.substr(0, 3)
      const symbol = rateValue.substr(3)
      const rate = await this.convert(base, symbol)
      return parseFloat(rate)
    } else {
      return parseFloat(rateValue) || 1
    }
  }

}

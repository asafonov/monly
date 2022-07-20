class Currency {

  buildUrl (base, symbol) {
    return `https://api.exchangerate.host/lates?base=${base}&symbols=${symbol}`
  }

  parseResponse (data, symbol) {
    return data.rates[symbol]
  }

  getFromCache (base, symbol) {
    const k = `currency_${base}${symbol}`
    const cache = JSON.parse(window.localStorage.getItem(k)) || {}
    const t = cache.t || 0
    const now = new Date().getTime()

    if (t + 12 * 3600 * 1000 > now) {
      return cache.value
    }

    return [null, cache.value || 1]
  }

  saveToCache (base, symbol, value) {
    const cache = {
      t: new Date().getTime(),
      value: value
    }
    const k = `currency_${base}${symbol}`

    window.localStorage.setItem(k, JSON.stringify(cache))
  }

  async convert (base, symbol) {
    let [ret, cache] = this.getFromCache(base, symbol)

    if (ret) return ret

    const url = this.buildUrl(base, symbol)

    try {
      const response = await fetch(url)
      const data = await response.json()
      ret = this.parseResponse(data, symbol)

      if (ret) this.saveToCache(base, symbol, ret)
    } catch (e) {}

    return ret || cache
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
      return rateValue
    }
  }

}

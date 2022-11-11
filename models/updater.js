class Updater {

  constructor (upstreamVersionUrl) {
    this.upstreamVersionUrl = upstreamVersionUrl
  }

  getCurrentVersion() {
    return window.asafonov.version
  }

  getUpstreamVersion() {
    return fetch(this.upstreamVersionUrl)
      .then(data => data.text())
      .then(data => data.replace(/[^0-9\.]/g, ''))
  }

  compareVersion (v1, v2) {
    const _v1 = v1.split('.')
    const _v2 = v2.split('.')
    let ret = false

    for (let i = 0; i < _v1.length; ++i) {
      if (parseInt(_v1[i], 10) > parseInt(_v2[i], 10)) {
        ret = true
        break
      }
    }

    return ret
  }

  getUpdateUrl (template) {
    return template.replace('{VERSION}', this.upstreamVersion)
  }

  isUpdateNeeded() {
    return this.getUpstreamVersion().
      then(upstreamVersion => {
        this.upstreamVersion = upstreamVersion
        const currentVersion = this.getCurrentVersion()
        return this.compareVersion(upstreamVersion, currentVersion)
      })
  }
}

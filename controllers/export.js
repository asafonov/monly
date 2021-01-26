class ExportController {

  constructor() {
  }

  build() {
    const keys = Object.keys(window.localStorage);
    let e = {};

    for (let k of keys) {
      e[k] = window.localStorage.getItem(k);
    }

    return e;
  }

  getDownloadUrl() {
    const data = btoa(JSON.stringify(this.build()));
    return `data:text/json;base64,${data}`;
  }
}

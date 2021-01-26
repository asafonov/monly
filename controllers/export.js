class ExportController {

  constructor() {
  }

  build() {
    const keys = Objects.keys(window.localStorage);
    let e = {};

    for (k of keys) {
      e[k] = window.localStorage.getItem(k);
    }

    return e;
  }

  download() {
    const data = JSON.stringify(this.build());
    window.location.href = `data:text/json charset=utf-8,${data}`;
  }
}

class ReportsController {

  buildOnDate (year, month, removeSource) {
    const reports = new Reports(year, month, removeSource);
    reports.build(removeSource);
    reports.destroy();
  }

  build() {
    let d = new Date();
    let month = d.getMonth()
    let year = d.getFullYear()

    if (month == 0) {
      month = 12
      year -= 1
    }

    this.buildOnDate(year, month, true);
  }

}
